// src/validators/auth.validator.ts
import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Senha deve ser uma string')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('restaurantId')
    .isString()
    .withMessage('ID do restaurante deve ser uma string')
    .notEmpty()
    .withMessage('ID do restaurante é obrigatório')
];

export const registerValidator = [
  body('name')
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Senha deve ser uma string')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('restaurantId')
    .isString()
    .withMessage('ID do restaurante deve ser uma string')
    .notEmpty()
    .withMessage('ID do restaurante é obrigatório'),
  body('roleId')
    .isString()
    .withMessage('ID do papel deve ser uma string')
    .notEmpty()
    .withMessage('ID do papel é obrigatório')
];

export const changePasswordValidator = [
  body('currentPassword')
    .isString()
    .withMessage('Senha atual deve ser uma string')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  body('newPassword')
    .isString()
    .withMessage('Nova senha deve ser uma string')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
    .not()
    .equals(body('currentPassword').value)
    .withMessage('Nova senha deve ser diferente da senha atual')
];
