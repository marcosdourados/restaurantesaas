// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware para validar os dados da requisição usando express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Executa todas as validações
    await Promise.all(validations.map(validation => validation.run(req)));

    // Verifica se houve erros de validação
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Retorna os erros de validação
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors.array()
    });
  };
};
