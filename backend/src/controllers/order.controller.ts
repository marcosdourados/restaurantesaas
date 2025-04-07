// src/controllers/order.controller.ts
import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model';
import { TableModel } from '../models/table.model';
import { ProductModel } from '../models/product.model';

export class OrderController {
  /**
   * Cria um novo pedido
   */
  static async create(req: Request, res: Response) {
    try {
      const { 
        tableId, 
        type, 
        customerName, 
        customerPhone, 
        customerAddress, 
        items, 
        notes 
      } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!type || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Tipo de pedido e itens são obrigatórios' 
        });
      }

      // Verifica se o tipo é válido
      const validTypes = ['local', 'delivery', 'takeout'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ 
          success: false,
          message: `Tipo de pedido inválido. Valores permitidos: ${validTypes.join(', ')}` 
        });
      }

      // Se for um pedido local, verifica se a mesa existe e pertence ao restaurante
      if (type === 'local') {
        if (!tableId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID da mesa é obrigatório para pedidos locais' 
          });
        }

        const table = await TableModel.findById(tableId);
        if (!table || table.restaurantId !== restaurantId) {
          return res.status(404).json({ 
            success: false,
            message: 'Mesa não encontrada ou não pertence a este restaurante' 
          });
        }
      }

      // Se for um pedido de entrega, verifica se os dados do cliente foram fornecidos
      if (type === 'delivery') {
        if (!customerName || !customerPhone || !customerAddress) {
          return res.status(400).json({ 
            success: false,
            message: 'Nome, telefone e endereço do cliente são obrigatórios para pedidos de entrega' 
          });
        }
      }

      // Verifica se todos os produtos existem e pertencem ao restaurante
      const productIds = items.map(item => item.productId);
      const products = await ProductModel.findByIds(productIds);
      
      if (products.length !== productIds.length) {
        return res.status(404).json({ 
          success: false,
          message: 'Um ou mais produtos não foram encontrados' 
        });
      }

      for (const product of products) {
        if (product.restaurantId !== restaurantId) {
          return res.status(403).json({ 
            success: false,
            message: 'Um ou mais produtos não pertencem a este restaurante' 
          });
        }
      }

      // Calcula o valor total do pedido
      let totalAmount = 0;
      const orderItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = product!.price * item.quantity;
        totalAmount += itemTotal;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product!.price,
          totalPrice: itemTotal,
          notes: item.notes
        };
      });

      // Cria o pedido
      const order = await OrderModel.create({
        restaurantId,
        tableId,
        type,
        status: 'pending',
        customerName,
        customerPhone,
        customerAddress,
        totalAmount,
        notes,
        items: orderItems
      });

      // Se for um pedido local, atualiza o status da mesa para ocupada
      if (type === 'local' && tableId) {
        await TableModel.updateStatus(tableId, 'occupied');
      }

      return res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca um pedido pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o pedido
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: 'Pedido não encontrado' 
        });
      }

      // Verifica se o pedido pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== order.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar este pedido' 
        });
      }

      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista pedidos com filtros
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
      const tableId = req.query.tableId as string | undefined;
      const status = req.query.status as string | undefined;
      const type = req.query.type as string | undefined;
      const dateStart = req.query.dateStart ? new Date(req.query.dateStart as string) : undefined;
      const dateEnd = req.query.dateEnd ? new Date(req.query.dateEnd as string) : undefined;

      // Busca os pedidos com os filtros
      const orders = await OrderModel.findByRestaurant(restaurantId, {
        tableId,
        status,
        type,
        dateStart,
        dateEnd
      });

      return res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza o status de um pedido
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
      const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'canceled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false,
          message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}` 
        });
      }

      // Busca o pedido
      const existingOrder = await OrderModel.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ 
          success: false,
          message: 'Pedido não encontrado' 
        });
      }

      // Verifica se o pedido pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingOrder.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este pedido' 
        });
      }

      // Atualiza o status do pedido
      const order = await OrderModel.updateStatus(id, status);

      // Se o pedido foi cancelado ou entregue e é um pedido local, libera a mesa
      if ((status === 'canceled' || status === 'delivered') && 
          existingOrder.type === 'local' && 
          existingOrder.tableId) {
        
        // Verifica se não há outros pedidos ativos para esta mesa
        const activeOrders = await OrderModel.findActiveByTable(existingOrder.tableId);
        if (activeOrders.length === 0) {
          await TableModel.updateStatus(existingOrder.tableId, 'available');
        }
      }

      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Adiciona um item ao pedido
   */
  static async addItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { productId, quantity, notes } = req.body;

      // Valida os dados de entrada
      if (!productId || !quantity) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do produto e quantidade são obrigatórios' 
        });
      }

      // Busca o pedido
      const existingOrder = await OrderModel.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ 
          success: false,
          message: 'Pedido não encontrado' 
        });
      }

      // Verifica se o pedido pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingOrder.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este pedido' 
        });
      }

      // Verifica se o pedido está em um estado que permite adicionar itens
      if (existingOrder.status === 'delivered' || existingOrder.status === 'canceled') {
        return res.status(400).json({ 
          success: false,
          message: 'Não é possível adicionar itens a um pedido entregue ou cancelado' 
        });
      }

      // Verifica se o produto existe e pertence ao restaurante
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      if (product.restaurantId !== existingOrder.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'O produto não pertence a este restaurante' 
        });
      }

      // Adiciona o item ao pedido
      const orderItem = await OrderModel.addItem(id, {
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        notes
      });

      return res.status(201).json({
        success: true,
        data: orderItem
      });
    } catch (error) {
      console.error('Erro ao adicionar item ao pedido:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove um item do pedido
   */
  static async removeItem(req: Request, res: Response) {
    try {
      const { id, itemId } = req.params;

      // Busca o pedido
      const existingOrder = await OrderModel.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ 
          success: false,
          message: 'Pedido não encontrado' 
        });
      }

      // Verifica se o pedido pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingOrder.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este pedido' 
        });
      }

      // Verifica se o pedido está em um estado que permite remover itens
      if (existingOrder.status === 'delivered' || existingOrder.status === 'canceled') {
        return res.status(400).json({ 
          success: false,
          message: 'Não é possível remover itens de um pedido entregue ou cancelado' 
        });
      }

      // Remove o item do pedido
      await OrderModel.removeItem(itemId);

      return res.status(200).json({
        success: true,
        message: 'Item removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover item do pedido:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
