// src/controllers/table.controller.ts
import { Request, Response } from 'express';
import { TableModel } from '../models/table.model';
import { AreaModel } from '../models/area.model';

export class TableController {
  /**
   * Cria uma nova mesa
   */
  static async create(req: Request, res: Response) {
    try {
      const { areaId, number, seats, qrCode, status } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!areaId || !number) {
        return res.status(400).json({ 
          success: false,
          message: 'Área e número da mesa são obrigatórios' 
        });
      }

      // Verifica se a área existe e pertence ao restaurante
      const area = await AreaModel.findById(areaId);
      if (!area || area.restaurantId !== restaurantId) {
        return res.status(404).json({ 
          success: false,
          message: 'Área não encontrada ou não pertence a este restaurante' 
        });
      }

      // Verifica se já existe uma mesa com este número na área
      const existingTable = await TableModel.findByNumberAndArea(number, areaId);
      if (existingTable) {
        return res.status(409).json({ 
          success: false,
          message: 'Já existe uma mesa com este número nesta área' 
        });
      }

      // Cria a mesa
      const table = await TableModel.create({
        restaurantId,
        areaId,
        number,
        seats: seats || 4,
        qrCode,
        status: status || 'available'
      });

      return res.status(201).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca uma mesa pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a mesa
      const table = await TableModel.findById(id);
      if (!table) {
        return res.status(404).json({ 
          success: false,
          message: 'Mesa não encontrada' 
        });
      }

      // Verifica se a mesa pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== table.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar esta mesa' 
        });
      }

      return res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error('Erro ao buscar mesa:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista mesas com filtros
   */
  static async findByFilters(req: Request, res: Response) {
    try {
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Extrai os filtros da query
      const areaId = req.query.areaId as string | undefined;
      const status = req.query.status as string | undefined;

      // Busca as mesas com os filtros
      const tables = await TableModel.findByRestaurant(restaurantId, {
        areaId,
        status
      });

      return res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      console.error('Erro ao listar mesas:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza uma mesa
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { areaId, number, seats, qrCode, status } = req.body;

      // Busca a mesa
      const existingTable = await TableModel.findById(id);
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          message: 'Mesa não encontrada' 
        });
      }

      // Verifica se a mesa pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingTable.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta mesa' 
        });
      }

      // Se a área foi fornecida, verifica se existe e pertence ao restaurante
      if (areaId) {
        const area = await AreaModel.findById(areaId);
        if (!area || area.restaurantId !== req.user?.restaurantId) {
          return res.status(404).json({ 
            success: false,
            message: 'Área não encontrada ou não pertence a este restaurante' 
          });
        }
      }

      // Se o número foi alterado, verifica se já existe uma mesa com este número na área
      if (number && number !== existingTable.number) {
        const targetAreaId = areaId || existingTable.areaId;
        const existingTableWithNumber = await TableModel.findByNumberAndArea(number, targetAreaId);
        if (existingTableWithNumber && existingTableWithNumber.id !== id) {
          return res.status(409).json({ 
            success: false,
            message: 'Já existe uma mesa com este número nesta área' 
          });
        }
      }

      // Atualiza a mesa
      const table = await TableModel.update(id, {
        areaId,
        number,
        seats,
        qrCode,
        status
      });

      return res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove uma mesa
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a mesa
      const existingTable = await TableModel.findById(id);
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          message: 'Mesa não encontrada' 
        });
      }

      // Verifica se a mesa pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingTable.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover esta mesa' 
        });
      }

      // Remove a mesa
      await TableModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Mesa removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover mesa:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza o status de uma mesa
   */
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Valida os dados de entrada
      if (!status) {
        return res.status(400).json({ 
          success: false,
          message: 'Status é obrigatório' 
        });
      }

      // Verifica se o status é válido
      const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false,
          message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}` 
        });
      }

      // Busca a mesa
      const existingTable = await TableModel.findById(id);
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          message: 'Mesa não encontrada' 
        });
      }

      // Verifica se a mesa pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingTable.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta mesa' 
        });
      }

      // Atualiza o status da mesa
      const table = await TableModel.updateStatus(id, status);

      return res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error('Erro ao atualizar status da mesa:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Gera um novo QR Code para a mesa
   */
  static async generateQrCode(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a mesa
      const existingTable = await TableModel.findById(id);
      if (!existingTable) {
        return res.status(404).json({ 
          success: false,
          message: 'Mesa não encontrada' 
        });
      }

      // Verifica se a mesa pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingTable.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta mesa' 
        });
      }

      // Gera um novo QR Code
      const table = await TableModel.generateQrCode(id);

      return res.status(200).json({
        success: true,
        data: table
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
