// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';

export class UserController {
  /**
   * Cria um novo usuário
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, email, password, roleId, active } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!name || !email || !password || !roleId) {
        return res.status(400).json({ 
          success: false,
          message: 'Nome, email, senha e papel são obrigatórios' 
        });
      }

      // Verifica se o papel existe
      const role = await RoleModel.findById(roleId);
      if (!role) {
        return res.status(404).json({ 
          success: false,
          message: 'Papel não encontrado' 
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
        roleId,
        active: active !== undefined ? active : true
      });

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user;
      return res.status(201).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca um usuário pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o usuário
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
      }

      // Verifica se o usuário pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== user.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar este usuário' 
        });
      }

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user;
      return res.status(200).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista todos os usuários do restaurante
   */
  static async findByRestaurant(req: Request, res: Response) {
    try {
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Busca os usuários do restaurante
      const users = await UserModel.findByRestaurant(restaurantId);

      // Remove a senha dos dados dos usuários
      const usersData = users.map(user => {
        const { password: _, ...userData } = user;
        return userData;
      });

      return res.status(200).json({
        success: true,
        data: usersData
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza um usuário
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, roleId, active } = req.body;

      // Busca o usuário
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
      }

      // Verifica se o usuário pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingUser.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este usuário' 
        });
      }

      // Se o papel foi fornecido, verifica se existe
      if (roleId) {
        const role = await RoleModel.findById(roleId);
        if (!role) {
          return res.status(404).json({ 
            success: false,
            message: 'Papel não encontrado' 
          });
        }
      }

      // Atualiza o usuário
      const user = await UserModel.update(id, {
        name,
        email,
        password,
        roleId,
        active
      });

      // Retorna os dados do usuário (sem a senha)
      const { password: _, ...userData } = user!;
      return res.status(200).json({
        success: true,
        data: userData
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove um usuário
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o usuário
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ 
          success: false,
          message: 'Usuário não encontrado' 
        });
      }

      // Verifica se o usuário pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingUser.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover este usuário' 
        });
      }

      // Remove o usuário
      await UserModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Usuário removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
