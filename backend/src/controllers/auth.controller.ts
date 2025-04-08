// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { RestaurantModel } from '../models/restaurant.model';

export class AuthController {
  /**
   * Realiza o login do usuário
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, restaurantId } = req.body;

      // Valida os dados de entrada
      if (!email || !password || !restaurantId) {
        res.status(400).json({ 
          success: false,
          message: 'Email, senha e ID do restaurante são obrigatórios' 
        });
        return;
      }

      // Tenta realizar o login
      const result = await AuthService.login(email, password, restaurantId);
      
      // Se o login falhar, retorna erro
      if (!result) {
        res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
        return;
      }

      // Retorna os dados do usuário e o token
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Registra um novo usuário
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, restaurantId, roleId } = req.body;

      // Valida os dados de entrada
      if (!name || !email || !password || !restaurantId || !roleId) {
        res.status(400).json({ 
          success: false,
          message: 'Todos os campos são obrigatórios' 
        });
        return;
      }

      // Verifica se o restaurante existe
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        res.status(404).json({ 
          success: false,
          message: 'Restaurante não encontrado' 
        });
        return;
      }

      // Verifica se já existe um usuário com este email no restaurante
      const existingUser = await UserModel.findByEmail(email, restaurantId);
      if (existingUser) {
        res.status(409).json({ 
          success: false,
          message: 'Já existe um usuário com este email neste restaurante' 
        });
        return;
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
      res.status(201).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Verifica se o token é válido e retorna os dados do usuário
   */
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      // O middleware de autenticação já verificou o token
      // e adicionou os dados do usuário ao objeto de requisição
      if (!req.user) {
        res.status(401).json({ 
          success: false,
          message: 'Usuário não autenticado' 
        });
        return;
      }

      // Busca os dados atualizados do usuário
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
        return;
      }

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user;
      res.status(200).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user) {
        res.status(401).json({ 
          success: false,
          message: 'Usuário não autenticado' 
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Valida os dados de entrada
      if (!currentPassword || !newPassword) {
        res.status(400).json({ 
          success: false,
          message: 'Senha atual e nova senha são obrigatórias' 
        });
        return;
      }

      // Busca o usuário
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
        return;
      }

      // Verifica se a senha atual está correta
      const isPasswordValid = await UserModel.verifyPassword(user, currentPassword);
      if (!isPasswordValid) {
        res.status(401).json({ 
          success: false,
          message: 'Senha atual incorreta' 
        });
        return;
      }

      // Atualiza a senha
      await UserModel.update(user.id, { password: newPassword });

      res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
