// src/routes/order.routes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  createOrderValidator, 
  updateStatusValidator, 
  addItemValidator 
} from '../validators/order.validator';

const router = Router();

// Rota para criar um novo pedido
router.post('/', 
  authenticate, 
  authorize('orders'), 
  validate(createOrderValidator), 
  OrderController.create
);

// Rota para buscar um pedido pelo ID
router.get('/:id', 
  authenticate, 
  OrderController.findById
);

// Rota para listar pedidos com filtros
router.get('/', 
  authenticate, 
  OrderController.findByFilters
);

// Rota para atualizar o status de um pedido
router.patch('/:id/status', 
  authenticate, 
  authorize('orders'), 
  validate(updateStatusValidator), 
  OrderController.updateStatus
);

// Rota para adicionar um item ao pedido
router.post('/:id/items', 
  authenticate, 
  authorize('orders'), 
  validate(addItemValidator), 
  OrderController.addItem
);

// Rota para remover um item do pedido
router.delete('/:id/items/:itemId', 
  authenticate, 
  authorize('orders'), 
  OrderController.removeItem
);

export default router;
