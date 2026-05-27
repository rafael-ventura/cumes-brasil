import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../Infrastructure/config/db';
import { Usuario } from '../../Domain/entities/Usuario';
import { safeLogger } from '../../Infrastructure/config/logger';

export async function requireAdmin (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usuarioId = req.user?.usuarioId;
    if (!usuarioId) {
      res.status(401).json({ error: 'Não autenticado', statusCode: 401 });
      return;
    }

    const usuario = await AppDataSource.getRepository(Usuario).findOne({
      where: { id: Number(usuarioId) },
      select: ['id', 'is_admin']
    });

    if (!usuario?.is_admin) {
      res.status(403).json({ error: 'Acesso restrito a administradores', statusCode: 403 });
      return;
    }

    next();
  } catch (error) {
    safeLogger.error('Erro no middleware admin', { error });
    res.status(500).json({ error: 'Erro interno do servidor', statusCode: 500 });
  }
}
