import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import winston from 'winston';
import { db } from './config/database';
import routes from './routes';
import csurf from 'csurf';
import cache from 'memory-cache';

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração de logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Inicializa o aplicativo Express
const app = express();
const port = process.env.PORT || 3001;

// Conecta ao banco de dados
db.connect()
  .then(() => logger.info('Conectado ao banco de dados'))
  .catch(err => {
    logger.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  });

// Configuração CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Rate limiting para prevenção de ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(compression()); // Compressão gzip/deflate
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(csurf());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date(),
    services: {
      database: db.getConnectionStatus() ? 'UP' : 'DOWN'
    }
  });
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema SaaS para Restaurantes funcionando!',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Rotas da API
app.use('/api', routes);

// Middleware para tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({
    message: 'Erro interno do servidor',
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Implementar cache
const cacheMiddleware = (duration: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      const originalSend = res.send;
      res.send = function(body: any): express.Response {
        cache.put(key, body, duration * 1000);
        return originalSend.call(this, body);
      };
      next();
    }
  };
};

// Inicializa o servidor
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV}`);
});

// Tratamento de encerramento do processo
process.on('SIGINT', async () => {
  await db.disconnect();
  logger.info('Conexão com o banco de dados encerrada');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promessa rejeitada não tratada:', reason);
});

export default app;
