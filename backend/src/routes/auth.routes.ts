// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { loginValidator, registerValidator, changePasswordValidator } from '../validators/auth.validator';

const router = Router();

// Rota de login
router.post('/login', validate(loginValidator) as any, AuthController.login);

// Rota de registro (protegida por autenticação)
router.post('/register', authenticate as any, validate(registerValidator) as any, AuthController.register);

// Rota para verificar token
router.get('/verify', authenticate as any, AuthController.verifyToken);

// Rota para alterar senha
router.post('/change-password', authenticate as any, validate(changePasswordValidator) as any, AuthController.changePassword);

export default router;
