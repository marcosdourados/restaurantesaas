// src/routes/fiscal.routes.ts
import { Router } from 'express';
import { FiscalController } from '../controllers/fiscal.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  issueInvoiceValidator, 
  cancelInvoiceValidator 
} from '../validators/fiscal.validator';

const router = Router();

// Rota para emitir uma nota fiscal para um pedido
router.post('/orders/:orderId/invoice', 
  authenticate, 
  authorize('fiscal'), 
  validate(issueInvoiceValidator), 
  FiscalController.issueInvoice
);

// Rota para cancelar uma nota fiscal
router.post('/invoices/:invoiceId/cancel', 
  authenticate, 
  authorize('fiscal'), 
  validate(cancelInvoiceValidator), 
  FiscalController.cancelInvoice
);

// Rota para verificar o status de uma nota fiscal
router.get('/invoices/:invoiceId/status', 
  authenticate, 
  FiscalController.checkInvoiceStatus
);

// Rota para gerar um DANFE em PDF para uma nota fiscal
router.get('/invoices/:invoiceId/danfe', 
  authenticate, 
  FiscalController.generateDanfePdf
);

export default router;
