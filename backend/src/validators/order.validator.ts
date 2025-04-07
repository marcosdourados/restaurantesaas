// src/validators/order.validator.ts
import { body } from 'express-validator';

export const createOrderValidator = [
  body('type')
    .isString()
    .withMessage('Tipo deve ser uma string')
    .isIn(['local', 'delivery', 'takeout'])
    .withMessage('Tipo inválido. Valores permitidos: local, delivery, takeout'),
  body('tableId')
    .if(body('type').equals('local'))
    .isString()
    .withMessage('ID da mesa deve ser uma string')
    .notEmpty()
    .withMessage('ID da mesa é obrigatório para pedidos locais'),
  body('customerName')
    .if(body('type').equals('delivery'))
    .isString()
    .withMessage('Nome do cliente deve ser uma string')
    .notEmpty()
    .withMessage('Nome do cliente é obrigatório para pedidos de entrega')
    .trim(),
  body('customerPhone')
    .if(body('type').equals('delivery'))
    .isString()
    .withMessage('Telefone do cliente deve ser uma string')
    .notEmpty()
    .withMessage('Telefone do cliente é obrigatório para pedidos de entrega'),
  body('customerAddress')
    .if(body('type').equals('delivery'))
    .isString()
    .withMessage('Endereço do cliente deve ser uma string')
    .notEmpty()
    .withMessage('Endereço do cliente é obrigatório para pedidos de entrega')
    .trim(),
  body('items')
    .isArray()
    .withMessage('Itens deve ser um array')
    .notEmpty()
    .withMessage('Itens não pode ser vazio'),
  body('items.*.productId')
    .isString()
    .withMessage('ID do produto deve ser uma string')
    .notEmpty()
    .withMessage('ID do produto é obrigatório'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um inteiro positivo'),
  body('items.*.notes')
    .optional()
    .isString()
    .withMessage('Observações deve ser uma string')
    .trim(),
  body('notes')
    .optional()
    .isString()
    .withMessage('Observações deve ser uma string')
    .trim()
];

export const updateStatusValidator = [
  body('status')
    .isString()
    .withMessage('Status deve ser uma string')
    .isIn(['pending', 'preparing', 'ready', 'delivered', 'canceled'])
    .withMessage('Status inválido. Valores permitidos: pending, preparing, ready, delivered, canceled')
];

export const addItemValidator = [
  body('productId')
    .isString()
    .withMessage('ID do produto deve ser uma string')
    .notEmpty()
    .withMessage('ID do produto é obrigatório'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um inteiro positivo'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Observações deve ser uma string')
    .trim()
];
