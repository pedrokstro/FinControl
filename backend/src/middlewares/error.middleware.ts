import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { sendError } from '@/utils/response';
import { logError } from '@/utils/logger';

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log do erro
  logError('Error occurred', error);

  // Se for um erro operacional conhecido
  if (error instanceof AppError) {
    sendError(
      res,
      error.message,
      error.statusCode,
      (error as any).errors,
      error.stack
    );
    return;
  }

  // Erros do TypeORM
  if (error.name === 'QueryFailedError') {
    sendError(res, 'Erro ao executar operação no banco de dados', 500);
    return;
  }

  // Erros de validação do TypeORM
  if (error.name === 'EntityNotFoundError') {
    sendError(res, 'Recurso não encontrado', 404);
    return;
  }

  // Erro genérico
  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : error.message,
    500,
    undefined,
    error.stack
  );
};

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendError(res, `Rota ${req.originalUrl} não encontrada`, 404);
};
