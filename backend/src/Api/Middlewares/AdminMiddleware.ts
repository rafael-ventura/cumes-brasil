import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../Infrastructure/config/db';
import { Usuario } from '../../Domain/entities/Usuario';
import { PapelUsuario } from '../../Domain/enum/EPapelUsuario';
import { safeLogger } from '../../Infrastructure/config/logger';
import { obterUsuarioIdAutenticado } from '../utils/usuarioRequisicao';

/**
 * Autorização baseada em papel (`role`). Fonte de verdade no banco — o `role`
 * é relido a cada requisição, então alterar o localStorage no cliente não concede
 * acesso real. Use atrás de `authenticateToken`.
 *
 * Ex.: `requireRole(PapelUsuario.Admin)`, `requireRole(PapelUsuario.Moderador, PapelUsuario.Admin)`.
 */
export function requireRole (...papeisPermitidos: PapelUsuario[]) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = obterUsuarioIdAutenticado(req);

      const usuario = await AppDataSource.getRepository(Usuario).findOne({
        where: { id: usuarioId },
        select: ['id', 'role']
      });

      if (!usuario || !papeisPermitidos.includes(usuario.role)) {
        res.status(403).json({ error: 'Acesso negado: permissão insuficiente', statusCode: 403 });
        return;
      }

      next();
    } catch (error) {
      safeLogger.error('Erro no middleware de autorização por papel', { error });
      res.status(500).json({ error: 'Erro interno do servidor', statusCode: 500 });
    }
  };
}

/** Atalho para rotas exclusivas de administradores. */
export const requireAdmin = requireRole(PapelUsuario.Admin);
