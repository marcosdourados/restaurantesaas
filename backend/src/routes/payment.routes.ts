// src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  processCardPaymentValidator, 
  refundTransactionValidator 
} from '../validators/payment.validator';

const router = Router();

// Rota para gerar QR Code PIX para pagamento
router.get('/orders/:orderId/pix', 
  authenticate, 
  authorize('payments'), 
  PaymentController.generatePixQrCode
);

// Rota para processar pagamento com cartão de crédito
router.post('/orders/:orderId/card', 
  authenticate, 
  authorize('payments'), 
  validate(processCardPaymentValidator), 
  PaymentController.processCardPayment
);

// Rota para verificar o status de uma transação
router.get('/transactions/:transactionId/status', 
  authenticate, 
  PaymentController.checkTransactionStatus
);

// Rota para estornar uma transação
router.post('/transactions/:transactionId/refund', 
  authenticate, 
  authorize('payments'), 
  validate(refundTransactionValidator), 
  PaymentController.refundTransaction
);

export default router;
