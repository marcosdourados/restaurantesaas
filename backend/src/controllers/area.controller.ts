// src/controllers/area.controller.ts
import { Request, Response } from 'express';
import { AreaModel } from '../models/area.model';

export class AreaController {
  /**
   * Cria uma nova área
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      
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
          message: 'Nome da área é obrigatório' 
        });
      }

      // Cria a área
      const area = await AreaModel.create({
        restaurantId,
        name,
        description
      });

      return res.status(201).json({
        success: true,
        data: area
      });
    } catch (error) {
      console.error('Erro ao criar área:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca uma área pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a área
      const area = await AreaModel.findById(id);
      if (!area) {
        return res.status(404).json({ 
          success: false,
          message: 'Área não encontrada' 
        });
      }

      // Verifica se a área pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== area.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar esta área' 
        });
      }

      return res.status(200).json({
        success: true,
        data: area
      });
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista todas as áreas do restaurante
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

      // Busca as áreas do restaurante
      const areas = await AreaModel.findByRestaurant(restaurantId);

      return res.status(200).json({
        success: true,
        data: areas
      });
    } catch (error) {
      console.error('Erro ao listar áreas:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza uma área
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Busca a área
      const existingArea = await AreaModel.findById(id);
      if (!existingArea) {
        return res.status(404).json({ 
          success: false,
          message: 'Área não encontrada' 
        });
      }

      // Verifica se a área pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingArea.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta área' 
        });
      }

      // Atualiza a área
      const area = await AreaModel.update(id, {
        name,
        description
      });

      return res.status(200).json({
        success: true,
        data: area
      });
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove uma área
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a área
      const existingArea = await AreaModel.findById(id);
      if (!existingArea) {
        return res.status(404).json({ 
          success: false,
          message: 'Área não encontrada' 
        });
      }

      // Verifica se a área pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingArea.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover esta área' 
        });
      }

      // Remove a área
      await AreaModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Área removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover área:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
