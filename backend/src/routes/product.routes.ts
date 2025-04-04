// src/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { 
  createProductValidator, 
  updateProductValidator, 
  updateAvailabilityValidator,
  addImageValidator
} from '../validators/product.validator';

const router = Router();

// Rota para criar um novo produto
router.post('/', 
  authenticate, 
  authorize('products'), 
  validate(createProductValidator), 
  ProductController.create
);

// Rota para buscar um produto pelo ID
router.get('/:id', 
  authenticate, 
  ProductController.findById
);

// Rota para listar produtos com filtros
router.get('/', 
  authenticate, 
  ProductController.findByFilters
);

// Rota para atualizar um produto
router.put('/:id', 
  authenticate, 
  authorize('products'), 
  validate(updateProductValidator), 
  ProductController.update
);

// Rota para remover um produto
router.delete('/:id', 
  authenticate, 
  authorize('products'), 
  ProductController.delete
);

// Rota para atualizar a disponibilidade de um produto
router.patch('/:id/availability', 
  authenticate, 
  authorize('products'), 
  validate(updateAvailabilityValidator), 
  ProductController.updateAvailability
);

// Rota para adicionar uma imagem ao produto
router.post('/:id/images', 
  authenticate, 
  authorize('products'), 
  validate(addImageValidator), 
  ProductController.addImage
);

// Rota para remover uma imagem do produto
router.delete('/:productId/images/:imageId', 
  authenticate, 
  authorize('products'), 
  ProductController.removeImage
);

export default router;
