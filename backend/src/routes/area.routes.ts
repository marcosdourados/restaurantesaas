// src/routes/area.routes.ts
import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createAreaValidator, updateAreaValidator } from '../validators/area.validator';

const router = Router();

// Rota para criar uma nova área
router.post('/', 
  authenticate, 
  authorize('tables'), 
  validate(createAreaValidator), 
  AreaController.create
);

// Rota para buscar uma área pelo ID
router.get('/:id', 
  authenticate, 
  AreaController.findById
);

// Rota para listar todas as áreas do restaurante
router.get('/', 
  authenticate, 
  AreaController.findByRestaurant
);

// Rota para atualizar uma área
router.put('/:id', 
  authenticate, 
  authorize('tables'), 
  validate(updateAreaValidator), 
  AreaController.update
);

// Rota para remover uma área
router.delete('/:id', 
  authenticate, 
  authorize('tables'), 
  AreaController.delete
);

export default router;
