import { AppDataSource } from '../config/db';
import BaseRepository from './BaseRepository';
import { UsuarioSeguindo } from '../../Domain/entities/UsuarioSeguindo';

export class UsuarioSeguindoRepository extends BaseRepository<UsuarioSeguindo> {
  constructor () {
    super(UsuarioSeguindo);
  }

  async listarQuemEuSigo (
    seguidorId: number
  ): Promise<Array<{ id: number; nome: string; username: string; perfil_publico: boolean; foto_url: string | null }>> {
    const raw = await this.repository
      .createQueryBuilder('us')
      .leftJoin('us.seguido', 'seguido')
      .leftJoin('seguido.foto_perfil', 'foto_perfil')
      .select([
        'seguido.id as id',
        'seguido.nome as nome',
        'seguido.username as username',
        'seguido.perfil_publico as perfil_publico',
        'foto_perfil.url as foto_url'
      ])
      .where('us."seguidorId" = :seguidorId', { seguidorId })
      .orderBy('seguido.nome', 'ASC')
      .getRawMany();

    return raw.map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      username: String(r.username ?? ''),
      perfil_publico: Boolean(r.perfil_publico),
      foto_url: r.foto_url ?? null
    }));
  }

  async listarQuemMeSegue (
    seguidoId: number
  ): Promise<Array<{ id: number; nome: string; username: string; perfil_publico: boolean; foto_url: string | null }>> {
    const raw = await this.repository
      .createQueryBuilder('us')
      .leftJoin('us.seguidor', 'seguidor')
      .leftJoin('seguidor.foto_perfil', 'foto_perfil')
      .select([
        'seguidor.id as id',
        'seguidor.nome as nome',
        'seguidor.username as username',
        'seguidor.perfil_publico as perfil_publico',
        'foto_perfil.url as foto_url'
      ])
      .where('us."seguidoId" = :seguidoId', { seguidoId })
      .orderBy('seguidor.nome', 'ASC')
      .getRawMany();

    return raw.map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      username: String(r.username ?? ''),
      perfil_publico: Boolean(r.perfil_publico),
      foto_url: r.foto_url ?? null
    }));
  }

  async existeSeguindo (seguidorId: number, seguidoId: number): Promise<boolean> {
    const qb = this.repository.createQueryBuilder('us')
      .where('us."seguidorId" = :seguidorId', { seguidorId })
      .andWhere('us."seguidoId" = :seguidoId', { seguidoId })
      .limit(1);

    const existe = await qb.getCount();
    return existe > 0;
  }

  async contarSeguindo (seguidorId: number): Promise<number> {
    return this.repository.createQueryBuilder('us')
      .where('us."seguidorId" = :seguidorId', { seguidorId })
      .getCount();
  }

  async contarSeguidores (seguidoId: number): Promise<number> {
    return this.repository.createQueryBuilder('us')
      .where('us."seguidoId" = :seguidoId', { seguidoId })
      .getCount();
  }

  async removerSeguindo (seguidorId: number, seguidoId: number): Promise<boolean> {
    const result = await this.repository.createQueryBuilder()
      .delete()
      .from(UsuarioSeguindo)
      .where('"seguidorId" = :seguidorId', { seguidorId })
      .andWhere('"seguidoId" = :seguidoId', { seguidoId })
      .execute();

    return (result.affected ?? 0) > 0;
  }
}

