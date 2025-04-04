// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createUserValidator, updateUserValidator } from '../validators/user.validator';

const router = Router();

// Rota para criar um novo usuário
router.post('/', 
  authenticate, 
  authorize('users'), 
  validate(createUserValidator), 
  UserController.create
);

// Rota para buscar um usuário pelo ID
router.get('/:id', 
  authenticate, 
  UserController.findById
);

// Rota para listar todos os usuários do restaurante
router.get('/', 
  authenticate, 
  UserController.findByRestaurant
);

// Rota para atualizar um usuário
router.put('/:id', 
  authenticate, 
  authorize('users'), 
  validate(updateUserValidator), 
  UserController.update
);

// Rota para remover um usuário
router.delete('/:id', 
  authenticate, 
  authorize('users'), 
  UserController.delete
);

export default router;
