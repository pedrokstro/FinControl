import { Response } from 'express';

/**
 * Interface para resposta de sucesso
 */
interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Interface para resposta de erro
 */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

/**
 * Envia resposta de sucesso
 */
export const sendSuccess = <T = any>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: any
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * Envia resposta de erro
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any,
  stack?: string
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;
  if (stack && process.env.NODE_ENV !== 'production') {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Envia resposta de criação (201)
 */
export const sendCreated = <T = any>(
  res: Response,
  data: T,
  message: string = 'Recurso criado com sucesso'
): Response => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Envia resposta sem conteúdo (204)
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Envia resposta paginada
 */
export const sendPaginated = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response => {
  const totalPages = Math.ceil(total / limit);

  return sendSuccess(
    res,
    data,
    message,
    200,
    {
      page,
      limit,
      total,
      totalPages,
    }
  );
};
