// src/validators/category.validator.ts
import { body } from 'express-validator';

export const createCategoryValidator = [
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
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem deve ser uma URL válida'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ordem deve ser um número inteiro não negativo'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um booleano')
];

export const updateCategoryValidator = [
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
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem deve ser uma URL válida'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ordem deve ser um número inteiro não negativo'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um booleano')
];

export const reorderCategoriesValidator = [
  body('ids')
    .isArray()
    .withMessage('IDs deve ser um array')
    .notEmpty()
    .withMessage('Lista de IDs não pode ser vazia')
    .custom(ids => {
      if (!ids.every(id => typeof id === 'string')) {
        throw new Error('Todos os IDs devem ser strings');
      }
      return true;
    })
];
