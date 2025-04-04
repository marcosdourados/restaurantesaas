// src/controllers/fiscal.controller.ts
import { Request, Response } from 'express';
import { FiscalService } from '../services/fiscal.service';
import { OrderModel } from '../models/order.model';

export class FiscalController {
  /**
   * Emite uma nota fiscal para um pedido
   */
  static async issueInvoice(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { customerDocument, customerEmail } = req.body;
      
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
      if (order.paymentStatus !== 'paid') {
        return res.status(400).json({ 
          success: false,
          message: 'Apenas pedidos pagos podem ter nota fiscal emitida' 
        });
      }

      // Verifica se já existe uma nota fiscal para este pedido
      if (order.invoiceId) {
        return res.status(409).json({ 
          success: false,
          message: 'Já existe uma nota fiscal para este pedido' 
        });
      }

      // Prepara os dados do pedido para emissão da nota fiscal
      const orderData = {
        items: order.items.map(item => ({
          productId: item.productId,
          description: item.description || 'Produto',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod || 'other',
        restaurantId: order.restaurantId
      };

      // Prepara os dados do cliente
      const customerData = {
        name: order.customerName || 'Consumidor Final',
        document: customerDocument,
        address: order.customerAddress,
        email: customerEmail
      };

      // Emite a nota fiscal
      const invoiceData = await FiscalService.issueInvoice(
        orderId,
        orderData,
        customerData
      );

      // Atualiza o pedido com o ID da nota fiscal
      await OrderModel.updateInvoiceId(orderId, invoiceData.invoiceId);

      return res.status(201).json({
        success: true,
        data: invoiceData
      });
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Cancela uma nota fiscal
   */
  static async cancelInvoice(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      const { reason } = req.body;
      
      // Valida os dados de entrada
      if (!reason) {
        return res.status(400).json({ 
          success: false,
          message: 'Motivo do cancelamento é obrigatório' 
        });
      }

      // Cancela a nota fiscal
      const cancellationData = await FiscalService.cancelInvoice(invoiceId, reason);

      return res.status(200).json({
        success: true,
        data: cancellationData
      });
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Consulta o status de uma nota fiscal
   */
  static async checkInvoiceStatus(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      
      // Verifica o status da nota fiscal
      const invoiceStatus = await FiscalService.checkInvoiceStatus(invoiceId);

      return res.status(200).json({
        success: true,
        data: invoiceStatus
      });
    } catch (error) {
      console.error('Erro ao verificar status da nota fiscal:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Gera um DANFE em PDF para uma nota fiscal
   */
  static async generateDanfePdf(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      
      // Gera o DANFE em PDF
      const pdfPath = await FiscalService.generateDanfePdf(invoiceId);

      // Envia o arquivo para o cliente
      return res.download(pdfPath, `danfe_${invoiceId}.pdf`, (err) => {
        if (err) {
          console.error('Erro ao enviar arquivo PDF:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Erro ao enviar arquivo PDF' 
          });
        }
        
        // Remove o arquivo temporário após o envio
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Erro ao remover arquivo temporário:', unlinkErr);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao gerar DANFE em PDF:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
