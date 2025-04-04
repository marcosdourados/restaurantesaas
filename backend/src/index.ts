import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { db } from './config/database';
import routes from './routes';

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o aplicativo Express
const app = express();
const port = process.env.PORT || 3001;

// Conecta ao banco de dados
db.connect()
  .then(() => console.log('Conectado ao banco de dados'))
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  });

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
});

// Tratamento de encerramento do processo
process.on('SIGINT', async () => {
  await db.disconnect();
  console.log('Conexão com o banco de dados encerrada');
  process.exit(0);
});

export default app;
