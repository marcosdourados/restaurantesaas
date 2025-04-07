// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { RestaurantModel } from '../models/restaurant.model';

export class AuthController {
  /**
   * Realiza o login do usuário
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password, restaurantId } = req.body;

      // Valida os dados de entrada
      if (!email || !password || !restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'Email, senha e ID do restaurante são obrigatórios' 
        });
      }

      // Tenta realizar o login
      const result = await AuthService.login(email, password, restaurantId);
      
      // Se o login falhar, retorna erro
      if (!result) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }

      // Retorna os dados do usuário e o token
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Registra um novo usuário
   */
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, restaurantId, roleId } = req.body;

      // Valida os dados de entrada
      if (!name || !email || !password || !restaurantId || !roleId) {
        return res.status(400).json({ 
          success: false,
          message: 'Todos os campos são obrigatórios' 
        });
      }

      // Verifica se o restaurante existe
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          message: 'Restaurante não encontrado' 
        });
      }

      // Verifica se já existe um usuário com este email no restaurante
      const existingUser = await UserModel.findByEmail(email, restaurantId);
      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          message: 'Já existe um usuário com este email neste restaurante' 
        });
      }

      // Cria o usuário
      const user = await UserModel.create({
        name,
        email,
        password,
        restaurantId,
        roleId
      });

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user;
      return res.status(201).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Verifica se o token é válido e retorna os dados do usuário
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      // O middleware de autenticação já verificou o token
      // e adicionou os dados do usuário ao objeto de requisição
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Usuário não autenticado' 
        });
      }

      // Busca os dados atualizados do usuário
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
      }

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user;
      return res.status(200).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(req: Request, res: Response) {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Usuário não autenticado' 
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Valida os dados de entrada
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          success: false,
          message: 'Senha atual e nova senha são obrigatórias' 
        });
      }

      // Busca o usuário
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
      }

      // Verifica se a senha atual está correta
      const isPasswordValid = await UserModel.verifyPassword(user, currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Senha atual incorreta' 
        });
      }

      // Atualiza a senha
      await UserModel.update(user.id, { password: newPassword });

      return res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
