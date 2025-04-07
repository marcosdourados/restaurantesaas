// src/routes/messaging.routes.ts
import { Router } from 'express';
import { MessagingController } from '../controllers/messaging.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  sendWhatsAppMessageValidator, 
  sendWhatsAppTemplateValidator, 
  sendOrderStatusNotificationValidator 
} from '../validators/messaging.validator';

const router = Router();

// Rota para enviar uma mensagem via WhatsApp
router.post('/whatsapp/message', 
  authenticate, 
  authorize('messaging'), 
  validate(sendWhatsAppMessageValidator), 
  MessagingController.sendWhatsAppMessage
);

// Rota para enviar uma mensagem com template via WhatsApp
router.post('/whatsapp/template', 
  authenticate, 
  authorize('messaging'), 
  validate(sendWhatsAppTemplateValidator), 
  MessagingController.sendWhatsAppTemplate
);

// Rota para enviar uma notificação de status de pedido via WhatsApp
router.post('/orders/:orderId/notification', 
  authenticate, 
  authorize('messaging'), 
  validate(sendOrderStatusNotificationValidator), 
  MessagingController.sendOrderStatusNotification
);

// Rota para verificar o status de uma mensagem
router.get('/messages/:messageId/status', 
  authenticate, 
  MessagingController.checkMessageStatus
);

export default router;
