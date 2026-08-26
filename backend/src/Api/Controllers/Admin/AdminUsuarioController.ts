import { Request, Response } from 'express';
import { AppDataSource } from '../../../Infrastructure/config/db';
import { Usuario } from '../../../Domain/entities/Usuario';
import { PapelUsuario, ehPapelValido } from '../../../Domain/enum/EPapelUsuario';
import NotFoundError from '../../../Application/errors/NotFoundError';
import BadRequestError from '../../../Application/errors/BadRequestError';
import { safeLogger } from '../../../Infrastructure/config/logger';
import { obterUsuarioIdAutenticado } from '../../utils/usuarioRequisicao';

export class AdminUsuarioController {
  listar = async (_req: Request, res: Response) => {
    const usuarios = await AppDataSource.getRepository(Usuario).find({
      select: ['id', 'nome', 'username', 'email', 'role', 'perfil_publico', 'created_at'],
      order: { created_at: 'DESC' }
    });
    // is_admin é getter (não serializa em res.json) — incluído explicitamente p/ o front.
    return res.json(usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      username: u.username,
      email: u.email,
      role: u.role,
      is_admin: u.role === PapelUsuario.Admin,
      perfil_publico: u.perfil_publico,
      created_at: u.created_at
    })));
  };

  /** Alterna entre admin e usuário comum. Mantido para compatibilidade do painel atual. */
  toggleAdmin = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const adminRequisitanteId = obterUsuarioIdAutenticado(req);

    if (id === adminRequisitanteId) {
      return res.status(400).json({ error: 'Não é possível alterar sua própria permissão de admin' });
    }

    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({ where: { id }, select: ['id', 'role', 'username'] });
    if (!usuario) throw new NotFoundError('Usuário não encontrado');

    usuario.role = usuario.role === PapelUsuario.Admin ? PapelUsuario.Usuario : PapelUsuario.Admin;
    await repo.save(usuario);

    safeLogger.info('Papel de usuário alterado (toggle)', { usuarioId: id, novoPapel: usuario.role, adminId: adminRequisitanteId });

    return res.json({ id: usuario.id, username: usuario.username, role: usuario.role, is_admin: usuario.role === PapelUsuario.Admin });
  };

  /** Define um papel específico (usuario | moderador | admin). */
  definirPapel = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new BadRequestError('Id inválido');
    const adminRequisitanteId = obterUsuarioIdAutenticado(req);

    const { role } = req.body ?? {};
    if (!ehPapelValido(role)) {
      throw new BadRequestError('Papel inválido. Use: usuario, moderador ou admin');
    }

    if (id === adminRequisitanteId && role !== PapelUsuario.Admin) {
      return res.status(400).json({ error: 'Não é possível rebaixar o seu próprio papel de admin' });
    }

    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({ where: { id }, select: ['id', 'role', 'username'] });
    if (!usuario) throw new NotFoundError('Usuário não encontrado');

    usuario.role = role;
    await repo.save(usuario);

    safeLogger.info('Papel de usuário definido', { usuarioId: id, novoPapel: role, adminId: adminRequisitanteId });

    return res.json({ id: usuario.id, username: usuario.username, role: usuario.role, is_admin: usuario.role === PapelUsuario.Admin });
  };

  estatisticas = async (_req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Usuario);
    const [total, admins] = await Promise.all([
      repo.count(),
      repo.count({ where: { role: PapelUsuario.Admin } })
    ]);
    return res.json({ total, admins });
  };
}
