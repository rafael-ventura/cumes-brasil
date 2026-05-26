import BaseRepository from './BaseRepository';
import { UsuarioConquista } from '../../Domain/entities/UsuarioConquista';
import { Usuario } from '../../Domain/entities/Usuario';
import { AppDataSource } from '../config/db';

export class UsuarioConquistaRepository extends BaseRepository<UsuarioConquista> {
  constructor () {
    super(UsuarioConquista);
  }

  async obterPorUsuarioETipo(usuarioId: number, tipo: string): Promise<UsuarioConquista | null> {
    return this.repository.findOne({
      where: {
        usuario: { id: usuarioId } as Usuario,
        tipo
      }
    });
  }

  async listarPorUsuario(usuarioId: number): Promise<UsuarioConquista[]> {
    return this.repository.find({
      where: {
        usuario: { id: usuarioId } as Usuario
      }
    });
  }

  async upsertUsuarioConquista(params: {
    usuarioId: number;
    tipo: string;
    valorAtual: number;
    tier: UsuarioConquista['tier'];
  }): Promise<void> {
    const existente = await this.obterPorUsuarioETipo(params.usuarioId, params.tipo);
    if (existente) {
      existente.valorAtual = params.valorAtual;
      existente.tier = params.tier;
      await AppDataSource.getRepository(UsuarioConquista).save(existente);
      return;
    }

    const created = this.repository.create({
      usuario: { id: params.usuarioId } as Usuario,
      tipo: params.tipo,
      valorAtual: params.valorAtual,
      tier: params.tier
    });
    await AppDataSource.getRepository(UsuarioConquista).save(created);
  }
}

