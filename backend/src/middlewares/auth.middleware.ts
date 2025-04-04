// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Estende a interface Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        restaurantId: string;
        roleId: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware para verificar se o usuário está autenticado
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtém o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    // Verifica se o formato do token é válido (Bearer <token>)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verifica e decodifica o token
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Adiciona os dados do usuário ao objeto de requisição
    req.user = decoded;

    // Continua para o próximo middleware ou controlador
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Middleware para verificar se o usuário tem a permissão necessária
 */
export const authorize = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      // Verifica se o usuário tem a permissão necessária
      const hasPermission = await AuthService.hasPermission(req.user.userId, permission);
      if (!hasPermission) {
        return res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
      }

      // Continua para o próximo middleware ou controlador
      next();
    } catch (error) {
      console.error('Erro no middleware de autorização:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
};

/**
 * Middleware para verificar se o usuário pertence ao restaurante especificado
 */
export const checkRestaurant = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verifica se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Obtém o ID do restaurante da requisição (pode vir de diferentes lugares)
    const restaurantId = req.params.restaurantId || req.body.restaurantId;
    
    // Se não houver ID de restaurante na requisição, continua
    if (!restaurantId) {
      return next();
    }

    // Verifica se o usuário pertence ao restaurante
    if (req.user.restaurantId !== restaurantId) {
      return res.status(403).json({ message: 'Acesso negado: usuário não pertence a este restaurante' });
    }

    // Continua para o próximo middleware ou controlador
    next();
  } catch (error) {
    console.error('Erro no middleware de verificação de restaurante:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
