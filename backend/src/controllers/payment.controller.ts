// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { OrderModel } from '../models/order.model';

export class PaymentController {
  /**
   * Gera um QR Code PIX para pagamento
   */
  static async generatePixQrCode(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      
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

      // Verifica se o pedido já foi pago
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ 
          success: false,
          message: 'Este pedido já foi pago' 
        });
      }

      // Gera o QR Code PIX
      const pixData = await PaymentService.generatePixQrCode(
        orderId,
        order.totalAmount,
        `Pedido #${order.id.substring(0, 8)} - ${req.user?.restaurantName || 'Restaurante'}`
      );

      return res.status(200).json({
        success: true,
        data: pixData
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code PIX:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Processa pagamento com cartão de crédito
   */
  static async processCardPayment(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { 
        cardNumber, 
        cardHolderName, 
        expiryMonth, 
        expiryYear, 
        cvv,
        installments 
      } = req.body;
      
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

      // Verifica se o pedido já foi pago
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ 
          success: false,
          message: 'Este pedido já foi pago' 
        });
      }

      // Valida os dados do cartão
      if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({ 
          success: false,
          message: 'Todos os dados do cartão são obrigatórios' 
        });
      }

      // Processa o pagamento com cartão
      const cardTransaction = await PaymentService.processCardPayment(
        orderId,
        order.totalAmount,
        {
          number: cardNumber,
          holderName: cardHolderName,
          expiryMonth,
          expiryYear,
          cvv
        },
        installments || 1
      );

      // Se o pagamento foi aprovado, atualiza o status do pedido
      if (cardTransaction.status === 'approved') {
        await OrderModel.updatePaymentStatus(orderId, 'paid', cardTransaction.transactionId);
      }

      return res.status(200).json({
        success: true,
        data: cardTransaction
      });
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Verifica o status de uma transação
   */
  static async checkTransactionStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      // Verifica o status da transação
      const transactionStatus = await PaymentService.checkTransactionStatus(transactionId);

      return res.status(200).json({
        success: true,
        data: transactionStatus
      });
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Estorna uma transação
   */
  static async refundTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const { amount } = req.body;
      
      // Estorna a transação
      const refundData = await PaymentService.refundTransaction(transactionId, amount);

      return res.status(200).json({
        success: true,
        data: refundData
      });
    } catch (error) {
      console.error('Erro ao estornar transação:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
