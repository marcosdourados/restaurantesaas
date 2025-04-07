// src/validators/delivery.validator.ts
import { body } from 'express-validator';

export const createDeliveryValidator = [
  body('orderId')
    .isString()
    .withMessage('ID do pedido deve ser uma string')
    .notEmpty()
    .withMessage('ID do pedido é obrigatório'),
  body('courierId')
    .optional()
    .isString()
    .withMessage('ID do entregador deve ser uma string')
    .notEmpty()
    .withMessage('ID do entregador não pode ser vazio'),
  body('estimatedTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Tempo estimado deve ser um inteiro positivo'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Observações deve ser uma string')
    .trim()
];

export const assignCourierValidator = [
  body('courierId')
    .isString()
    .withMessage('ID do entregador deve ser uma string')
    .notEmpty()
    .withMessage('ID do entregador é obrigatório')
];

export const cancelDeliveryValidator = [
  body('reason')
    .optional()
    .isString()
    .withMessage('Motivo deve ser uma string')
    .trim()
];
