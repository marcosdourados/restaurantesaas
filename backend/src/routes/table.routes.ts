// src/routes/table.routes.ts
import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  createTableValidator, 
  updateTableValidator, 
  updateStatusValidator
} from '../validators/table.validator';

const router = Router();

// Rota para criar uma nova mesa
router.post('/', 
  authenticate, 
  authorize('tables'), 
  validate(createTableValidator), 
  TableController.create
);

// Rota para buscar uma mesa pelo ID
router.get('/:id', 
  authenticate, 
  TableController.findById
);

// Rota para listar mesas com filtros
router.get('/', 
  authenticate, 
  TableController.findByFilters
);

// Rota para atualizar uma mesa
router.put('/:id', 
  authenticate, 
  authorize('tables'), 
  validate(updateTableValidator), 
  TableController.update
);

// Rota para remover uma mesa
router.delete('/:id', 
  authenticate, 
  authorize('tables'), 
  TableController.delete
);

// Rota para atualizar o status de uma mesa
router.patch('/:id/status', 
  authenticate, 
  authorize('tables'), 
  validate(updateStatusValidator), 
  TableController.updateStatus
);

// Rota para gerar um novo QR Code para a mesa
router.post('/:id/generate-qrcode', 
  authenticate, 
  authorize('tables'), 
  TableController.generateQrCode
);

export default router;
