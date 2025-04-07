// src/validators/payment.validator.ts
import { body } from 'express-validator';

export const processCardPaymentValidator = [
  body('cardNumber')
    .isString()
    .withMessage('Número do cartão deve ser uma string')
    .matches(/^\d{13,19}$/)
    .withMessage('Número do cartão inválido'),
  body('cardHolderName')
    .isString()
    .withMessage('Nome do titular deve ser uma string')
    .notEmpty()
    .withMessage('Nome do titular é obrigatório')
    .trim(),
  body('expiryMonth')
    .isString()
    .withMessage('Mês de expiração deve ser uma string')
    .matches(/^(0[1-9]|1[0-2])$/)
    .withMessage('Mês de expiração inválido'),
  body('expiryYear')
    .isString()
    .withMessage('Ano de expiração deve ser uma string')
    .matches(/^\d{4}$/)
    .withMessage('Ano de expiração inválido'),
  body('cvv')
    .isString()
    .withMessage('CVV deve ser uma string')
    .matches(/^\d{3,4}$/)
    .withMessage('CVV inválido'),
  body('installments')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Número de parcelas deve ser um inteiro entre 1 e 12')
];

export const refundTransactionValidator = [
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .custom(value => value > 0)
    .withMessage('Valor deve ser maior que zero')
];
