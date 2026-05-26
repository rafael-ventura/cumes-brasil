import { Request, Response } from 'express';
import NotFoundError from '../../Application/errors/NotFoundError';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { UsuarioConquistaRepository } from '../../Infrastructure/repositories/UsuarioConquistaRepository';
import { ConquistasService } from '../../Application/services/ConquistasService';

export class ConquistasController {
  private service: ConquistasService;

  constructor () {
    const usuarioRepo = new UsuarioRepository();
    const escaladaRepo = new EscaladaRepository();
    const usuarioConquistaRepo = new UsuarioConquistaRepository();
    this.service = new ConquistasService(usuarioRepo, escaladaRepo, usuarioConquistaRepo);
  }

  obterConquistasMe = async (req: Request, res: Response) => {
    const usuarioIdAtual = parseInt(req.user.usuarioId, 10);
    if (!usuarioIdAtual || Number.isNaN(usuarioIdAtual)) {
      throw new NotFoundError('Usuário não autenticado');
    }

    const conquistas = await this.service.obterConquistasMe(usuarioIdAtual);
    return res.status(200).json(conquistas);
  };

  obterConquistasPorUsername = async (req: Request, res: Response) => {
    const username = String(req.params.username || '').trim().toLowerCase();
    if (!username) throw new NotFoundError('Username inválido');

    const usuarioIdAtual = req.user?.usuarioId
      ? parseInt(req.user.usuarioId, 10)
      : null;

    const conquistas = await this.service.obterConquistasPorUsername(username, usuarioIdAtual);
    if (!conquistas) return res.status(404).json({ error: 'Conquistas indisponíveis' });

    return res.status(200).json(conquistas);
  };
}

