// src/controllers/restaurant.controller.ts
import { Request, Response } from 'express';
import { RestaurantModel } from '../models/restaurant.model';

export class RestaurantController {
  /**
   * Cria um novo restaurante
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, logoUrl, address, phone, email, taxId, settings } = req.body;

      // Valida os dados de entrada
      if (!name) {
        return res.status(400).json({ 
          success: false,
          message: 'Nome do restaurante é obrigatório' 
        });
      }

      // Cria o restaurante
      const restaurant = await RestaurantModel.create({
        name,
        logoUrl,
        address,
        phone,
        email,
        taxId,
        settings
      });

      return res.status(201).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      console.error('Erro ao criar restaurante:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca um restaurante pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o restaurante
      const restaurant = await RestaurantModel.findById(id);
      if (!restaurant) {
        return res.status(404).json({ 
          success: false,
          message: 'Restaurante não encontrado' 
        });
      }

      return res.status(200).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      console.error('Erro ao buscar restaurante:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista todos os restaurantes
   */
  static async findAll(req: Request, res: Response) {
    try {
      const restaurants = await RestaurantModel.findAll();

      return res.status(200).json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      console.error('Erro ao listar restaurantes:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza um restaurante
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, logoUrl, address, phone, email, taxId, settings } = req.body;

      // Verifica se o restaurante existe
      const existingRestaurant = await RestaurantModel.findById(id);
      if (!existingRestaurant) {
        return res.status(404).json({ 
          success: false,
          message: 'Restaurante não encontrado' 
        });
      }

      // Verifica se o usuário tem permissão para atualizar este restaurante
      if (req.user && req.user.restaurantId !== id) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este restaurante' 
        });
      }

      // Atualiza o restaurante
      const restaurant = await RestaurantModel.update(id, {
        name,
        logoUrl,
        address,
        phone,
        email,
        taxId,
        settings
      });

      return res.status(200).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      console.error('Erro ao atualizar restaurante:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove um restaurante
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se o restaurante existe
      const existingRestaurant = await RestaurantModel.findById(id);
      if (!existingRestaurant) {
        return res.status(404).json({ 
          success: false,
          message: 'Restaurante não encontrado' 
        });
      }

      // Verifica se o usuário tem permissão para remover este restaurante
      if (req.user && req.user.restaurantId !== id) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover este restaurante' 
        });
      }

      // Remove o restaurante
      await RestaurantModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Restaurante removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover restaurante:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
