import { Request, Response } from 'express';
import { AppDataSource } from '../../../Infrastructure/config/db';
import { Usuario } from '../../../Domain/entities/Usuario';
import NotFoundError from '../../../Application/errors/NotFoundError';
import { safeLogger } from '../../../Infrastructure/config/logger';

export class AdminUsuarioController {
  listar = async (_req: Request, res: Response) => {
    const usuarios = await AppDataSource.getRepository(Usuario).find({
      select: ['id', 'nome', 'username', 'email', 'is_admin', 'perfil_publico', 'created_at'],
      order: { created_at: 'DESC' }
    });
    return res.json(usuarios);
  };

  toggleAdmin = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const adminRequisitanteId = Number(req.user.usuarioId);

    if (id === adminRequisitanteId) {
      return res.status(400).json({ error: 'Não é possível alterar sua própria permissão de admin' });
    }

    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({ where: { id }, select: ['id', 'is_admin', 'username'] });
    if (!usuario) throw new NotFoundError('Usuário não encontrado');

    usuario.is_admin = !usuario.is_admin;
    await repo.save(usuario);

    safeLogger.info('Permissão admin alterada', { usuarioId: id, novoValor: usuario.is_admin, adminId: adminRequisitanteId });

    return res.json({ id: usuario.id, username: usuario.username, is_admin: usuario.is_admin });
  };

  estatisticas = async (_req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Usuario);
    const [total, admins] = await Promise.all([
      repo.count(),
      repo.count({ where: { is_admin: true } })
    ]);
    return res.json({ total, admins });
  };
}
