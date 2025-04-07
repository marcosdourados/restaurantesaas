// src/validators/area.validator.ts
import { body } from 'express-validator';

export const createAreaValidator = [
  body('name')
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string')
    .trim()
];

export const updateAreaValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string')
    .trim()
];
