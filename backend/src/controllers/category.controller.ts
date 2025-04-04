// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.model';

export class CategoryController {
  /**
   * Cria uma nova categoria
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, description, imageUrl, order, active } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!name) {
        return res.status(400).json({ 
          success: false,
          message: 'Nome da categoria é obrigatório' 
        });
      }

      // Cria a categoria
      const category = await CategoryModel.create({
        restaurantId,
        name,
        description,
        imageUrl,
        order,
        active
      });

      return res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca uma categoria pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a categoria
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: 'Categoria não encontrada' 
        });
      }

      // Verifica se a categoria pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== category.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar esta categoria' 
        });
      }

      return res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista todas as categorias do restaurante
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

      // Verifica se deve retornar apenas categorias ativas
      const activeOnly = req.query.activeOnly === 'true';

      // Busca as categorias do restaurante
      const categories = await CategoryModel.findByRestaurant(restaurantId, activeOnly);

      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza uma categoria
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, imageUrl, order, active } = req.body;

      // Busca a categoria
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Categoria não encontrada' 
        });
      }

      // Verifica se a categoria pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingCategory.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta categoria' 
        });
      }

      // Atualiza a categoria
      const category = await CategoryModel.update(id, {
        name,
        description,
        imageUrl,
        order,
        active
      });

      return res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove uma categoria
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a categoria
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Categoria não encontrada' 
        });
      }

      // Verifica se a categoria pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingCategory.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover esta categoria' 
        });
      }

      // Remove a categoria
      await CategoryModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Reordena categorias
   */
  static async reorder(req: Request, res: Response) {
    try {
      const { ids } = req.body;

      // Valida os dados de entrada
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Lista de IDs de categorias é obrigatória' 
        });
      }

      // Reordena as categorias
      const success = await CategoryModel.reorder(ids);

      if (!success) {
        return res.status(400).json({ 
          success: false,
          message: 'Erro ao reordenar categorias' 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Categorias reordenadas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao reordenar categorias:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
