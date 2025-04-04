// src/routes/category.routes.ts
import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCategoryValidator, updateCategoryValidator, reorderCategoriesValidator } from '../validators/category.validator';

const router = Router();

// Rota para criar uma nova categoria
router.post('/', 
  authenticate, 
  authorize('products'), 
  validate(createCategoryValidator), 
  CategoryController.create
);

// Rota para buscar uma categoria pelo ID
router.get('/:id', 
  authenticate, 
  CategoryController.findById
);

// Rota para listar todas as categorias do restaurante
router.get('/', 
  authenticate, 
  CategoryController.findByRestaurant
);

// Rota para atualizar uma categoria
router.put('/:id', 
  authenticate, 
  authorize('products'), 
  validate(updateCategoryValidator), 
  CategoryController.update
);

// Rota para remover uma categoria
router.delete('/:id', 
  authenticate, 
  authorize('products'), 
  CategoryController.delete
);

// Rota para reordenar categorias
router.post('/reorder', 
  authenticate, 
  authorize('products'), 
  validate(reorderCategoriesValidator), 
  CategoryController.reorder
);

export default router;
