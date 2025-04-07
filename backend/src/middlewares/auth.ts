import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import winston from 'winston';

// Definição de tipo para payload do token JWT
interface JwtPayload {
  id: string;
  email: string;
  restaurantId: string;
  roleId: string;
  iat: number;
  exp: number;
}

// Extensão do tipo Request para incluir o usuário após autenticação
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        restaurantId: string;
        roleId: string;
        permissions?: string[];
      };
    }
  }
}

// Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/auth-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/auth.log' })
  ]
});

/**
 * Middleware de autenticação via JWT
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extrai o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;
    
    // Verifica se o usuário existe e está ativo
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        email: decoded.email,
        restaurantId: decoded.restaurantId,
        active: true
      },
      include: {
        role: true
      }
    });

    if (!user) {
      logger.warn({
        message: 'Tentativa de autenticação com usuário inexistente ou inativo',
        userId: decoded.id,
        ip: req.ip
      });
      
      return res.status(401).json({
        success: false,
        message: 'Usuário inexistente ou inativo'
      });
    }

    // Atualiza o último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Adiciona informações do usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      restaurantId: user.restaurantId,
      roleId: user.roleId,
      permissions: user.role.permissions ? JSON.parse(user.role.permissions as string) : []
    };

    logger.info({
      message: 'Usuário autenticado com sucesso',
      userId: user.id,
      restaurantId: user.restaurantId,
      ip: req.ip
    });

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn({
        message: 'Token expirado',
        ip: req.ip
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token expirado, faça login novamente'
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn({
        message: 'Token inválido',
        ip: req.ip,
        error: error.message
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    logger.error({
      message: 'Erro durante autenticação',
      ip: req.ip,
      error
    });

    return res.status(500).json({
      success: false,
      message: 'Erro durante autenticação'
    });
  }
};

/**
 * Middleware para verificação de permissões
 * @param requiredPermissions Array de permissões necessárias
 */
export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Verifica se o usuário possui as permissões necessárias
      const userPermissions = req.user.permissions || [];
      
      // Se o usuário não tiver permissões ou a lista de permissões do usuário estiver vazia
      if (requiredPermissions.length > 0 && (!userPermissions || userPermissions.length === 0)) {
        logger.warn({
          message: 'Acesso negado - sem permissões',
          userId: req.user.id,
          requiredPermissions,
          ip: req.ip
        });
        
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verifica se o usuário possui todas as permissões necessárias
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission) || userPermissions.includes('admin')
      );

      if (!hasAllPermissions) {
        logger.warn({
          message: 'Acesso negado - permissões insuficientes',
          userId: req.user.id,
          userPermissions,
          requiredPermissions,
          ip: req.ip
        });
        
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Se tudo estiver ok, continua
      return next();
    } catch (error) {
      logger.error({
        message: 'Erro durante verificação de permissões',
        ip: req.ip,
        error
      });

      return res.status(500).json({
        success: false,
        message: 'Erro durante verificação de permissões'
      });
    }
  };
};

export default {
  authenticate,
  authorize
}; 