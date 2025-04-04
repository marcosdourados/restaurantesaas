// src/validators/product.validator.ts
import { body } from 'express-validator';

export const createProductValidator = [
  body('categoryId')
    .isString()
    .withMessage('ID da categoria deve ser uma string')
    .notEmpty()
    .withMessage('ID da categoria é obrigatório'),
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
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Preço deve ser um número')
    .custom(value => value >= 0)
    .withMessage('Preço não pode ser negativo'),
  body('cost')
    .optional()
    .isNumeric()
    .withMessage('Custo deve ser um número')
    .custom(value => value >= 0)
    .withMessage('Custo não pode ser negativo'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem deve ser uma URL válida'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Disponibilidade deve ser um booleano')
];

export const updateProductValidator = [
  body('categoryId')
    .optional()
    .isString()
    .withMessage('ID da categoria deve ser uma string')
    .notEmpty()
    .withMessage('ID da categoria não pode ser vazio'),
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
    .trim(),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Preço deve ser um número')
    .custom(value => value >= 0)
    .withMessage('Preço não pode ser negativo'),
  body('cost')
    .optional()
    .isNumeric()
    .withMessage('Custo deve ser um número')
    .custom(value => value >= 0)
    .withMessage('Custo não pode ser negativo'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem deve ser uma URL válida'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('Disponibilidade deve ser um booleano')
];

export const updateAvailabilityValidator = [
  body('available')
    .isBoolean()
    .withMessage('Disponibilidade deve ser um booleano')
];

export const addImageValidator = [
  body('url')
    .isURL()
    .withMessage('URL da imagem deve ser uma URL válida'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ordem deve ser um número inteiro não negativo')
];
