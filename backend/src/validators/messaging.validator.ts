// src/validators/messaging.validator.ts
import { body } from 'express-validator';

export const sendWhatsAppMessageValidator = [
  body('phoneNumber')
    .isString()
    .withMessage('Número de telefone deve ser uma string')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Número de telefone inválido'),
  body('message')
    .isString()
    .withMessage('Mensagem deve ser uma string')
    .notEmpty()
    .withMessage('Mensagem é obrigatória')
    .trim()
];

export const sendWhatsAppTemplateValidator = [
  body('phoneNumber')
    .isString()
    .withMessage('Número de telefone deve ser uma string')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Número de telefone inválido'),
  body('templateName')
    .isString()
    .withMessage('Nome do template deve ser uma string')
    .notEmpty()
    .withMessage('Nome do template é obrigatório')
    .trim(),
  body('templateData')
    .isObject()
    .withMessage('Dados do template devem ser um objeto')
];

export const sendOrderStatusNotificationValidator = [
  body('trackingUrl')
    .optional()
    .isURL()
    .withMessage('URL de acompanhamento deve ser uma URL válida')
];
