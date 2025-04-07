// src/controllers/messaging.controller.ts
import { Request, Response } from 'express';
import { MessagingService } from '../services/messaging.service';
import { OrderModel } from '../models/order.model';

export class MessagingController {
  /**
   * Envia uma mensagem via WhatsApp
   */
  static async sendWhatsAppMessage(req: Request, res: Response) {
    try {
      const { phoneNumber, message } = req.body;
      
      // Valida os dados de entrada
      if (!phoneNumber || !message) {
        return res.status(400).json({ 
          success: false,
          message: 'Número de telefone e mensagem são obrigatórios' 
        });
      }

      // Envia a mensagem
      const messageData = await MessagingService.sendWhatsAppMessage(
        phoneNumber,
        message
      );

      return res.status(200).json({
        success: true,
        data: messageData
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Envia uma mensagem com template via WhatsApp
   */
  static async sendWhatsAppTemplate(req: Request, res: Response) {
    try {
      const { phoneNumber, templateName, templateData } = req.body;
      
      // Valida os dados de entrada
      if (!phoneNumber || !templateName || !templateData) {
        return res.status(400).json({ 
          success: false,
          message: 'Número de telefone, nome do template e dados do template são obrigatórios' 
        });
      }

      // Envia o template
      const messageData = await MessagingService.sendWhatsAppTemplate(
        phoneNumber,
        templateName,
        templateData
      );

      return res.status(200).json({
        success: true,
        data: messageData
      });
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Envia uma notificação de status de pedido via WhatsApp
   */
  static async sendOrderStatusNotification(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { trackingUrl } = req.body;
      
      // Busca o pedido
      const order = await OrderModel.findById(orderId);
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

      // Verifica se o pedido tem um número de telefone
      if (!order.customerPhone) {
        return res.status(400).json({ 
          success: false,
          message: 'O pedido não possui um número de telefone para envio de notificação' 
        });
      }

      // Envia a notificação
      const messageData = await MessagingService.sendOrderStatusNotification(
        order.customerPhone,
        orderId,
        order.status,
        trackingUrl
      );

      return res.status(200).json({
        success: true,
        data: messageData
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de status:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Verifica o status de uma mensagem
   */
  static async checkMessageStatus(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      
      // Verifica o status da mensagem
      const messageStatus = await MessagingService.checkMessageStatus(messageId);

      return res.status(200).json({
        success: true,
        data: messageStatus
      });
    } catch (error) {
      console.error('Erro ao verificar status da mensagem:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
