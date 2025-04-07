import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import winston from 'winston';

// Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'validator' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

/**
 * Middleware de validação usando Zod
 * @param schema Schema Zod para validação
 * @param source Fonte dos dados (body, query, params)
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida os dados da requisição
      const data = await schema.parseAsync(req[source]);
      
      // Atualiza req[source] com os dados validados e sanitizados
      req[source] = data;
      
      return next();
    } catch (error) {
      // Log do erro de validação
      logger.warn({
        message: 'Erro de validação',
        path: req.path,
        method: req.method,
        ip: req.ip,
        error: error instanceof ZodError ? error.errors : error
      });
      
      // Retorna erro 400 Bad Request com detalhes da validação
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }

      // Outros erros
      return res.status(500).json({
        success: false,
        message: 'Erro interno durante validação'
      });
    }
  };
};

export default validate; 