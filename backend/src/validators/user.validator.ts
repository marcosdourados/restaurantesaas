// src/validators/user.validator.ts
import { body } from 'express-validator';

export const createUserValidator = [
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
  body('roleId')
    .isString()
    .withMessage('ID do papel deve ser uma string')
    .notEmpty()
    .withMessage('ID do papel é obrigatório'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um booleano')
];

export const updateUserValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isString()
    .withMessage('Senha deve ser uma string')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('roleId')
    .optional()
    .isString()
    .withMessage('ID do papel deve ser uma string')
    .notEmpty()
    .withMessage('ID do papel não pode ser vazio'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um booleano')
];
