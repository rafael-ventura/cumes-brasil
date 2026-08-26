import { Request } from 'express';
import UnauthorizedError from '../../Application/errors/UnauthorizedError';

/**
 * Lê o usuarioId do JWT decodificado em `req.user`.
 * Use em rotas atrás de `authenticateToken` — onde a presença é garantida.
 * Lança UnauthorizedError se faltar (defesa em profundidade).
 */
export function obterUsuarioIdAutenticado(req: Request): number {
  const raw = req.user?.usuarioId;
  if (raw === undefined || raw === null || raw === '') {
    throw new UnauthorizedError('Usuário não autenticado');
  }
  const id = Number(raw);
  if (Number.isNaN(id)) {
    throw new UnauthorizedError('Token inválido');
  }
  return id;
}

/**
 * Versão para rotas com `optionalAuthenticateToken` — retorna undefined se não houver token.
 */
export function obterUsuarioIdOpcional(req: Request): number | undefined {
  const raw = req.user?.usuarioId;
  if (raw === undefined || raw === null || raw === '') return undefined;
  const id = Number(raw);
  return Number.isNaN(id) ? undefined : id;
}
