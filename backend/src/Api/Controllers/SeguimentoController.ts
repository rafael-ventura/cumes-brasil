import { Request, Response } from 'express';
import NotFoundError from '../../Application/errors/NotFoundError';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { UsuarioSeguindoRepository } from '../../Infrastructure/repositories/UsuarioSeguindoRepository';
import { SeguimentoService } from '../../Application/services/SeguimentoService';
import { obterUsuarioIdAutenticado, obterUsuarioIdOpcional } from '../utils/usuarioRequisicao';

export class SeguimentoController {
  private service: SeguimentoService;

  constructor () {
    const usuarioRepo = new UsuarioRepository();
    const usuarioSeguindoRepo = new UsuarioSeguindoRepository();
    this.service = new SeguimentoService(usuarioRepo, usuarioSeguindoRepo);
  }

  obterEstatisticasMe = async (req: Request, res: Response) => {
    const usuarioIdAtual = obterUsuarioIdAutenticado(req);

    const stats = await this.service.obterEstatisticasMe(usuarioIdAtual);
    return res.status(200).json(stats);
  };

  obterEstatisticasPorUsername = async (req: Request, res: Response) => {
    const username = String(req.params.username || '').trim().toLowerCase();
    if (!username) throw new NotFoundError('Username inválido');

    const usuarioIdAtual = obterUsuarioIdOpcional(req) ?? null;

    const stats = await this.service.obterEstatisticasPorUsername(username, usuarioIdAtual);
    if (!stats) return res.status(404).json({ error: 'Usuário não encontrado' });

    return res.status(200).json(stats);
  };

  seguirUsuario = async (req: Request, res: Response) => {
    const usuarioIdAtual = obterUsuarioIdAutenticado(req);
    const seguidoUsername = String(req.params.username || '').trim().toLowerCase();

    if (!seguidoUsername) throw new NotFoundError('Username inválido');

    try {
      await this.service.seguirUsuario(usuarioIdAtual, seguidoUsername);
    } catch (err: any) {
      throw new NotFoundError(err?.message || 'Erro ao seguir usuário');
    }

    return res.status(200).json({ ok: true });
  };

  deixarDeSeguirUsuario = async (req: Request, res: Response) => {
    const usuarioIdAtual = obterUsuarioIdAutenticado(req);
    const seguidoUsername = String(req.params.username || '').trim().toLowerCase();

    if (!seguidoUsername) throw new NotFoundError('Username inválido');

    try {
      await this.service.deixarDeSeguirUsuario(usuarioIdAtual, seguidoUsername);
    } catch (err: any) {
      throw new NotFoundError(err?.message || 'Erro ao deixar de seguir usuário');
    }

    return res.status(200).json({ ok: true });
  };

  listarSeguindoMe = async (req: Request, res: Response) => {
    const usuarioIdAtual = obterUsuarioIdAutenticado(req);

    const lista = await this.service.listarSeguindoMe(usuarioIdAtual);
    return res.status(200).json({ usuarios: lista });
  };

  listarSeguidoresMe = async (req: Request, res: Response) => {
    const usuarioIdAtual = obterUsuarioIdAutenticado(req);

    const lista = await this.service.listarSeguidoresMe(usuarioIdAtual);
    return res.status(200).json({ usuarios: lista });
  };
}

