// src/validators/restaurant.validator.ts
import { body } from 'express-validator';

export const createRestaurantValidator = [
  body('name')
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .trim(),
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('URL do logo deve ser uma URL válida'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Endereço deve ser um objeto'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Telefone deve ser uma string'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('taxId')
    .optional()
    .isString()
    .withMessage('CNPJ deve ser uma string'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Configurações devem ser um objeto')
];

export const updateRestaurantValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .notEmpty()
    .withMessage('Nome não pode ser vazio')
    .trim(),
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('URL do logo deve ser uma URL válida'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Endereço deve ser um objeto'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Telefone deve ser uma string'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('taxId')
    .optional()
    .isString()
    .withMessage('CNPJ deve ser uma string'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Configurações devem ser um objeto')
];
