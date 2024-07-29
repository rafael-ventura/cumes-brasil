import { Via } from '../../Domain/entities/Via';
import { AppDataSource } from '../config/db';

export class ViaRepository {

  private repository = AppDataSource.getRepository(Via);

  async getById (id: number): Promise<Via | null> {
    return this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("via.id = :id", { id })
      .getOne();
  }

  async getAll (page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
      .leftJoinAndSelect('via.fonte', 'fonte')
      .leftJoinAndSelect('via.face', 'face')
      .leftJoinAndSelect('via.imagem', 'imagem')
      .leftJoinAndSelect('via.croquis', 'croquis')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      vias,
      total
    };
  }

  async create (via: Partial<Via>): Promise<void> {
    await this.repository.insert(via);
  }

  async update (id: number, viaData: Partial<Via>): Promise<void> {
    await this.repository.update(id as any, viaData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id as any);
  }

  async getViasByColecaoId (colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
      .leftJoinAndSelect("via.viasColecoes", "viasColecoes")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("viasColecoes.colecao_id = :colecaoId", { colecaoId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      vias,
      total
    };
  }

  async getViasNotInColecaoId (colecaoId: number, page: number, limit: number): Promise<{
    vias: Via[],
    total: number
  }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
      .leftJoinAndSelect('via.viasColecoes', 'viasColecoes')
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
      .leftJoinAndSelect('via.fonte', 'fonte')
      .leftJoinAndSelect('via.face', 'face')
      .leftJoinAndSelect('via.imagem', 'imagem')
      .leftJoinAndSelect('via.croquis', 'croquis')
      .where('viasColecoes.colecao_id IS NULL OR viasColecoes.colecao_id != :colecaoId', { colecaoId })
      .andWhere((qb) => {
        const subQuery = qb.subQuery()
          .select('via.id')
          .from('via', 'via')
          .leftJoin('via.viasColecoes', 'viasColecoes')
          .where('viasColecoes.colecao_id = :colecaoId')
          .getQuery();
        return 'via.id NOT IN ' + subQuery;
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      vias,
      total
    };
  }

  async getAllWithoutPagination (): Promise<{ vias: Via[], total: number }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
      .leftJoinAndSelect('via.fonte', 'fonte')
      .leftJoinAndSelect('via.face', 'face')
      .leftJoinAndSelect('via.imagem', 'imagem')
      .leftJoinAndSelect('via.croquis', 'croquis')
      .getManyAndCount();
    return {
      vias,
      total
    };
  }
}
