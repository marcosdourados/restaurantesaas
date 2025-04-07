// src/validators/fiscal.validator.ts
import { body } from 'express-validator';

export const issueInvoiceValidator = [
  body('customerDocument')
    .optional()
    .isString()
    .withMessage('Documento do cliente deve ser uma string')
    .trim(),
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Email do cliente deve ser um email válido')
    .trim()
];

export const cancelInvoiceValidator = [
  body('reason')
    .isString()
    .withMessage('Motivo do cancelamento deve ser uma string')
    .notEmpty()
    .withMessage('Motivo do cancelamento é obrigatório')
    .trim()
];
