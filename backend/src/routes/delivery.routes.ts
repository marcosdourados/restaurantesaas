// src/routes/delivery.routes.ts
import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  createDeliveryValidator, 
  assignCourierValidator, 
  cancelDeliveryValidator 
} from '../validators/delivery.validator';

const router = Router();

// Rota para criar uma nova entrega
router.post('/', 
  authenticate, 
  authorize('deliveries'), 
  validate(createDeliveryValidator), 
  DeliveryController.create
);

// Rota para buscar uma entrega pelo ID
router.get('/:id', 
  authenticate, 
  DeliveryController.findById
);

// Rota para listar entregas com filtros
router.get('/', 
  authenticate, 
  DeliveryController.findByFilters
);

// Rota para atribuir um entregador à entrega
router.patch('/:id/assign', 
  authenticate, 
  authorize('deliveries'), 
  validate(assignCourierValidator), 
  DeliveryController.assignCourier
);

// Rota para iniciar uma entrega
router.post('/:id/start', 
  authenticate, 
  authorize('deliveries'), 
  DeliveryController.start
);

// Rota para finalizar uma entrega
router.post('/:id/complete', 
  authenticate, 
  authorize('deliveries'), 
  DeliveryController.complete
);

// Rota para cancelar uma entrega
router.post('/:id/cancel', 
  authenticate, 
  authorize('deliveries'), 
  validate(cancelDeliveryValidator), 
  DeliveryController.cancel
);

export default router;
