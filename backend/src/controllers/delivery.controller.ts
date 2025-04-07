// src/controllers/delivery.controller.ts
import { Request, Response } from 'express';
import { DeliveryModel } from '../models/delivery.model';
import { OrderModel } from '../models/order.model';
import { CourierModel } from '../models/courier.model';

export class DeliveryController {
  /**
   * Cria uma nova entrega
   */
  static async create(req: Request, res: Response) {
    try {
      const { orderId, courierId, estimatedTime, notes } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!orderId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do pedido é obrigatório' 
        });
      }

      // Verifica se o pedido existe e pertence ao restaurante
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: 'Pedido não encontrado' 
        });
      }

      if (order.restaurantId !== restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'O pedido não pertence a este restaurante' 
        });
      }

      // Verifica se o pedido é do tipo delivery
      if (order.type !== 'delivery') {
        return res.status(400).json({ 
          success: false,
          message: 'Apenas pedidos do tipo delivery podem ter entregas' 
        });
      }

      // Verifica se já existe uma entrega para este pedido
      const existingDelivery = await DeliveryModel.findByOrderId(orderId);
      if (existingDelivery) {
        return res.status(409).json({ 
          success: false,
          message: 'Já existe uma entrega para este pedido' 
        });
      }

      // Se um entregador foi fornecido, verifica se existe e pertence ao restaurante
      if (courierId) {
        const courier = await CourierModel.findById(courierId);
        if (!courier) {
          return res.status(404).json({ 
            success: false,
            message: 'Entregador não encontrado' 
          });
        }

        if (courier.restaurantId !== restaurantId) {
          return res.status(403).json({ 
            success: false,
            message: 'O entregador não pertence a este restaurante' 
          });
        }
      }

      // Cria a entrega
      const delivery = await DeliveryModel.create({
        orderId,
        courierId,
        estimatedTime,
        notes
      });

      // Atualiza o status do pedido para "preparing"
      await OrderModel.updateStatus(orderId, 'preparing');

      return res.status(201).json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca uma entrega pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a entrega
      const delivery = await DeliveryModel.findById(id);
      if (!delivery) {
        return res.status(404).json({ 
          success: false,
          message: 'Entrega não encontrada' 
        });
      }

      // Verifica se a entrega pertence a um pedido do restaurante do usuário autenticado
      const order = await OrderModel.findById(delivery.orderId);
      if (!order || order.restaurantId !== req.user?.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar esta entrega' 
        });
      }

      return res.status(200).json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Erro ao buscar entrega:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista entregas com filtros
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
      const status = req.query.status as string | undefined;
      const courierId = req.query.courierId as string | undefined;

      // Busca as entregas com os filtros
      let deliveries;
      
      if (status) {
        deliveries = await DeliveryModel.findByStatus(status, restaurantId);
      } else if (courierId) {
        deliveries = await DeliveryModel.findByCourier(courierId);
      } else {
        // Busca todas as entregas dos pedidos do restaurante
        const orders = await OrderModel.findByRestaurant(restaurantId, { type: 'delivery' });
        const orderIds = orders.map(order => order.id);
        
        if (orderIds.length === 0) {
          return res.status(200).json({
            success: true,
            data: []
          });
        }
        
        // Implementação simplificada - na prática, seria melhor ter um método específico no modelo
        deliveries = [];
        for (const orderId of orderIds) {
          const delivery = await DeliveryModel.findByOrderId(orderId);
          if (delivery) {
            deliveries.push(delivery);
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: deliveries
      });
    } catch (error) {
      console.error('Erro ao listar entregas:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atribui um entregador à entrega
   */
  static async assignCourier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { courierId } = req.body;

      // Valida os dados de entrada
      if (!courierId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do entregador é obrigatório' 
        });
      }

      // Busca a entrega
      const delivery = await DeliveryModel.findById(id);
      if (!delivery) {
        return res.status(404).json({ 
          success: false,
          message: 'Entrega não encontrada' 
        });
      }

      // Verifica se a entrega pertence a um pedido do restaurante do usuário autenticado
      const order = await OrderModel.findById(delivery.orderId);
      if (!order || order.restaurantId !== req.user?.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta entrega' 
        });
      }

      // Verifica se o entregador existe e pertence ao restaurante
      const courier = await CourierModel.findById(courierId);
      if (!courier) {
        return res.status(404).json({ 
          success: false,
          message: 'Entregador não encontrado' 
        });
      }

      if (courier.restaurantId !== order.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'O entregador não pertence a este restaurante' 
        });
      }

      // Atribui o entregador à entrega
      const updatedDelivery = await DeliveryModel.assignCourier(id, courierId);

      return res.status(200).json({
        success: true,
        data: updatedDelivery
      });
    } catch (error) {
      console.error('Erro ao atribuir entregador:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Inicia uma entrega
   */
  static async start(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a entrega
      const delivery = await DeliveryModel.findById(id);
      if (!delivery) {
        return res.status(404).json({ 
          success: false,
          message: 'Entrega não encontrada' 
        });
      }

      // Verifica se a entrega pertence a um pedido do restaurante do usuário autenticado
      const order = await OrderModel.findById(delivery.orderId);
      if (!order || order.restaurantId !== req.user?.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta entrega' 
        });
      }

      // Verifica se a entrega tem um entregador atribuído
      if (!delivery.courierId) {
        return res.status(400).json({ 
          success: false,
          message: 'A entrega precisa ter um entregador atribuído antes de ser iniciada' 
        });
      }

      // Inicia a entrega
      const updatedDelivery = await DeliveryModel.start(id);

      // Atualiza o status do pedido para "ready"
      await OrderModel.updateStatus(delivery.orderId, 'ready');

      return res.status(200).json({
        success: true,
        data: updatedDelivery
      });
    } catch (error) {
      console.error('Erro ao iniciar entrega:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Finaliza uma entrega
   */
  static async complete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca a entrega
      const delivery = await DeliveryModel.findById(id);
      if (!delivery) {
        return res.status(404).json({ 
          success: false,
          message: 'Entrega não encontrada' 
        });
      }

      // Verifica se a entrega pertence a um pedido do restaurante do usuário autenticado
      const order = await OrderModel.findById(delivery.orderId);
      if (!order || order.restaurantId !== req.user?.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta entrega' 
        });
      }

      // Verifica se a entrega está em andamento
      if (delivery.status !== 'in_progress') {
        return res.status(400).json({ 
          success: false,
          message: 'Apenas entregas em andamento podem ser finalizadas' 
        });
      }

      // Finaliza a entrega
      const updatedDelivery = await DeliveryModel.complete(id);

      return res.status(200).json({
        success: true,
        data: updatedDelivery
      });
    } catch (error) {
      console.error('Erro ao finalizar entrega:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Cancela uma entrega
   */
  static async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      // Busca a entrega
      const delivery = await DeliveryModel.findById(id);
      if (!delivery) {
        return res.status(404).json({ 
          success: false,
          message: 'Entrega não encontrada' 
        });
      }

      // Verifica se a entrega pertence a um pedido do restaurante do usuário autenticado
      const order = await OrderModel.findById(delivery.orderId);
      if (!order || order.restaurantId !== req.user?.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar esta entrega' 
        });
      }

      // Verifica se a entrega já foi entregue
      if (delivery.status === 'delivered') {
        return res.status(400).json({ 
          success: false,
          message: 'Não é possível cancelar uma entrega já finalizada' 
        });
      }

      // Cancela a entrega
      const updatedDelivery = await DeliveryModel.cancel(id, reason);

      return res.status(200).json({
        success: true,
        data: updatedDelivery
      });
    } catch (error) {
      console.error('Erro ao cancelar entrega:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
