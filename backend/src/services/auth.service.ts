// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';

export interface AuthTokenPayload {
  userId: string;
  restaurantId: string;
  roleId: string;
  email: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    restaurantId: string;
    role: {
      id: string;
      name: string;
      permissions: any;
    };
  };
  token: string;
}

export class AuthService {
  /**
   * Realiza o login do usuário
   */
  static async login(email: string, password: string, restaurantId: string): Promise<LoginResponse | null> {
    // Busca o usuário pelo email e restaurante
    const user = await UserModel.findByEmail(email, restaurantId);
    
    // Se o usuário não existir ou estiver inativo, retorna null
    if (!user || !user.active) {
      return null;
    }
    
    // Verifica se a senha está correta
    const isPasswordValid = await UserModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      return null;
    }
    
    // Atualiza a data do último login
    await UserModel.updateLastLogin(user.id);
    
    // Busca o papel do usuário com as permissões
    const role = await RoleModel.findById(user.roleId);
    if (!role) {
      return null;
    }
    
    // Gera o token JWT
    const token = this.generateToken({
      userId: user.id,
      restaurantId: user.restaurantId,
      roleId: user.roleId,
      email: user.email
    });
    
    // Retorna os dados do usuário e o token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        restaurantId: user.restaurantId,
        role: {
          id: role.id,
          name: role.name,
          permissions: role.permissions
        }
      },
      token
    };
  }
  
  /**
   * Gera um token JWT
   */
  static generateToken(payload: AuthTokenPayload): string {
    const secret = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_para_jwt';
    const expiresIn = '24h'; // Token válido por 24 horas
    
    return jwt.sign(payload, secret, { expiresIn });
  }
  
  /**
   * Verifica e decodifica um token JWT
   */
  static verifyToken(token: string): AuthTokenPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_para_jwt';
      const decoded = jwt.verify(token, secret) as AuthTokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Verifica se o usuário tem a permissão necessária
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    // Busca o usuário com o papel
    const user = await UserModel.findById(userId);
    if (!user) {
      return false;
    }
    
    // Busca o papel com as permissões
    const role = await RoleModel.findById(user.roleId);
    if (!role) {
      return false;
    }
    
    // Verifica se o papel tem a permissão 'all' (acesso total)
    const permissions = typeof role.permissions === 'string' 
      ? JSON.parse(role.permissions) 
      : role.permissions;
    
    if (permissions && permissions.all === true) {
      return true;
    }
    
    // Verifica se o papel tem a permissão específica
    return !!(permissions && permissions[permission] === true);
  }
}
