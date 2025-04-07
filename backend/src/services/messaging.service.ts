// src/services/messaging.service.ts
import axios from 'axios';
import { config } from '../config/config';

export class MessagingService {
  /**
   * Envia uma mensagem via WhatsApp
   * @param phoneNumber Número de telefone do destinatário
   * @param message Mensagem a ser enviada
   * @returns Dados do envio
   */
  static async sendWhatsAppMessage(phoneNumber: string, message: string) {
    try {
      // Em um ambiente real, aqui seria feita a integração com a API do WhatsApp Business
      // ou serviços como Twilio, Zenvia, etc.
      
      // Simulação de integração com API de mensageria
      const messageData = {
        messageId: `WA_${Date.now()}`,
        phoneNumber,
        message,
        sentAt: new Date(),
        status: 'sent'
      };

      console.log(`[WhatsApp] Mensagem enviada para ${phoneNumber}: ${message}`);

      return messageData;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      throw new Error('Falha ao enviar mensagem WhatsApp');
    }
  }

  /**
   * Envia uma mensagem com template via WhatsApp
   * @param phoneNumber Número de telefone do destinatário
   * @param templateName Nome do template
   * @param templateData Dados para preencher o template
   * @returns Dados do envio
   */
  static async sendWhatsAppTemplate(
    phoneNumber: string, 
    templateName: string, 
    templateData: Record<string, string>
  ) {
    try {
      // Em um ambiente real, aqui seria feita a integração com a API do WhatsApp Business
      
      // Simulação de integração com API de mensageria
      const messageData = {
        messageId: `WA_TEMPLATE_${Date.now()}`,
        phoneNumber,
        templateName,
        templateData,
        sentAt: new Date(),
        status: 'sent'
      };

      console.log(`[WhatsApp] Template "${templateName}" enviado para ${phoneNumber}`);

      return messageData;
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      throw new Error('Falha ao enviar template WhatsApp');
    }
  }

  /**
   * Envia uma notificação de status de pedido via WhatsApp
   * @param phoneNumber Número de telefone do destinatário
   * @param orderId ID do pedido
   * @param status Status do pedido
   * @param trackingUrl URL de acompanhamento (opcional)
   * @returns Dados do envio
   */
  static async sendOrderStatusNotification(
    phoneNumber: string,
    orderId: string,
    status: string,
    trackingUrl?: string
  ) {
    try {
      // Mapeia o status para uma mensagem amigável
      const statusMessages: Record<string, string> = {
        'pending': 'Recebemos seu pedido e estamos processando',
        'preparing': 'Seu pedido está sendo preparado',
        'ready': 'Seu pedido está pronto e saindo para entrega',
        'delivered': 'Seu pedido foi entregue. Bom apetite!',
        'canceled': 'Seu pedido foi cancelado'
      };

      const statusMessage = statusMessages[status] || `Status do pedido: ${status}`;
      
      // Constrói a mensagem
      let message = `*Atualização do Pedido #${orderId.substring(0, 8)}*\n\n${statusMessage}`;
      
      if (trackingUrl) {
        message += `\n\nAcompanhe seu pedido: ${trackingUrl}`;
      }

      // Envia a mensagem
      return await this.sendWhatsAppMessage(phoneNumber, message);
    } catch (error) {
      console.error('Erro ao enviar notificação de status:', error);
      throw new Error('Falha ao enviar notificação de status');
    }
  }

  /**
   * Verifica o status de uma mensagem
   * @param messageId ID da mensagem
   * @returns Status da mensagem
   */
  static async checkMessageStatus(messageId: string) {
    try {
      // Em um ambiente real, aqui seria feita a consulta à API de mensageria
      
      // Simulação de consulta de status
      const statuses = ['sent', 'delivered', 'read', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        messageId,
        status: randomStatus,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Erro ao verificar status da mensagem:', error);
      throw new Error('Falha ao verificar status da mensagem');
    }
  }
}
