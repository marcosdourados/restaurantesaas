// src/config/performance.ts
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';

/**
 * Configura otimizações de performance para o servidor Express
 * @param app Instância do Express
 */
export const configurePerformance = (app: Express) => {
  // Compressão de resposta para reduzir o tamanho dos dados transferidos
  app.use(compression());

  // Helmet para segurança de cabeçalhos HTTP
  app.use(helmet());

  // Limitador de taxa para prevenir ataques de força bruta
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Muitas requisições deste IP, por favor tente novamente após 15 minutos'
    }
  });

  // Aplicar limitador de taxa a todas as rotas de API
  app.use('/api', limiter);

  // Configurar cache para recursos estáticos
  app.use('/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 dia
    next();
  });

  return app;
};
