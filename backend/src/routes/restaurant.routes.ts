// src/routes/restaurant.routes.ts
import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createRestaurantValidator, updateRestaurantValidator } from '../validators/restaurant.validator';

const router = Router();

// Rota para criar um novo restaurante
router.post('/', 
  authenticate, 
  authorize('admin'), 
  validate(createRestaurantValidator), 
  RestaurantController.create
);

// Rota para buscar um restaurante pelo ID
router.get('/:id', 
  authenticate, 
  RestaurantController.findById
);

// Rota para listar todos os restaurantes
router.get('/', 
  authenticate, 
  authorize('admin'), 
  RestaurantController.findAll
);

// Rota para atualizar um restaurante
router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  validate(updateRestaurantValidator), 
  RestaurantController.update
);

// Rota para remover um restaurante
router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  RestaurantController.delete
);

export default router;
