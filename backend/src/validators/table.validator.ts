// src/validators/table.validator.ts
import { body } from 'express-validator';

export const createTableValidator = [
  body('areaId')
    .isString()
    .withMessage('ID da área deve ser uma string')
    .notEmpty()
    .withMessage('ID da área é obrigatório'),
  body('number')
    .isInt({ min: 1 })
    .withMessage('Número da mesa deve ser um inteiro positivo'),
  body('seats')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de lugares deve ser um inteiro positivo'),
  body('qrCode')
    .optional()
    .isString()
    .withMessage('QR Code deve ser uma string'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'reserved', 'maintenance'])
    .withMessage('Status inválido. Valores permitidos: available, occupied, reserved, maintenance')
];

export const updateTableValidator = [
  body('areaId')
    .optional()
    .isString()
    .withMessage('ID da área deve ser uma string')
    .notEmpty()
    .withMessage('ID da área não pode ser vazio'),
  body('number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número da mesa deve ser um inteiro positivo'),
  body('seats')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de lugares deve ser um inteiro positivo'),
  body('qrCode')
    .optional()
    .isString()
    .withMessage('QR Code deve ser uma string'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'reserved', 'maintenance'])
    .withMessage('Status inválido. Valores permitidos: available, occupied, reserved, maintenance')
];

export const updateStatusValidator = [
  body('status')
    .isString()
    .withMessage('Status deve ser uma string')
    .isIn(['available', 'occupied', 'reserved', 'maintenance'])
    .withMessage('Status inválido. Valores permitidos: available, occupied, reserved, maintenance')
];
