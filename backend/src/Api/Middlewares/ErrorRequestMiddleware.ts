import { NextFunction, Request, Response } from 'express';
import { safeLogger } from '../../Infrastructure/config/logger';
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from '../../Application/errors';

// Interface para erros customizados
interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Middleware de tratamento de erro global
export function errorRequestMiddleware(err: CustomError, req: Request, res: Response, next: NextFunction) {
  // Log do erro
  safeLogger.error('Erro na requisição', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determinar status code
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  // Preferir propriedades padronizadas quando disponíveis
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if ((err as any).status) { // compatibilidade com antigos Error.status
    statusCode = (err as any).status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados inválidos';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Dados duplicados';
  } else if (err.message) {
    // Heurísticas temporárias de mapeamento por mensagem para preservar comportamento atual
    const normalized = err.message.toLowerCase();
    const isNotFound =
      normalized.includes('não encontrada') ||
      normalized.includes('nenhuma via encontrada') ||
      normalized.includes('nenhuma escalada encontrada') ||
      normalized.includes('nenhuma escalada encontrada para esta via') ||
      normalized.includes('nenhuma escalada encontrada para este usuário') ||
      normalized.includes('usuario não encontrado') ||
      normalized.includes('usuário não encontrado');

    const isBadRequest =
      normalized.includes('inválido') ||
      normalized.includes('não fornecido') ||
      normalized.includes('parâmetros inválidos') ||
      normalized.includes('campos obrigatórios') ||
      normalized.includes('filtro inválido');

    if (isNotFound) {
      statusCode = 404;
      message = err.message;
    } else if (isBadRequest) {
      statusCode = 400;
      message = err.message;
    }
  }

  // Em desenvolvimento, incluir stack trace
  const response: any = {
    error: message,
    statusCode
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

// Middleware para capturar erros assíncronos
export function asyncErrorHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Middleware para capturar erros de rotas não encontradas
export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = new NotFoundError(`Rota não encontrada: ${req.method} ${req.url}`);
  next(error);
}
