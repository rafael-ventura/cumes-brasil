import { Via } from '../../Domain/entities/Via';
import { AppDataSource } from '../config/db';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';

export class ViaRepository implements ISearchRepository<Via>{

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

  async getViasByColecaoId(colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
        .leftJoinAndSelect('via.montanha', 'montanha')
        .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
        .leftJoinAndSelect('via.fonte', 'fonte')
        .leftJoinAndSelect('via.face', 'face')
        .leftJoinAndSelect('via.imagem', 'imagem')
        .leftJoin('via.colecoes', 'colecoes')
        .where('colecoes.id = :colecaoId', { colecaoId })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
      vias,
      total
    };
  }

  async getViasNotInColecaoId(colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    const [vias, total] = await this.repository.createQueryBuilder('via')
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
      .leftJoinAndSelect('via.fonte', 'fonte')
      .leftJoinAndSelect('via.face', 'face')
      .leftJoinAndSelect('via.imagem', 'imagem')
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('via_colecao.via_id')
          .from('via_colecao', 'via_colecao')
          .where('via_colecao.colecao_id = :colecaoId')
          .getQuery();
        return `via.id NOT IN ${subQuery}`;
      })
      .setParameter('colecaoId', colecaoId)
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

  async search(query: any): Promise<ISearchResult<Via>> {
    const {
      unifiedSearch,
      selectedMountain,
      selectedDifficulty,
      selectedCrux,
      selectedExtensionCategory,
      selectedExposicao,
      colecaoId,
      bairro,
      page = 1,
      itemsPerPage = 10
    } = query;

    let qb = this.repository.createQueryBuilder('via')
        .leftJoinAndSelect('via.montanha', 'montanha')
        .leftJoinAndSelect('via.imagem', 'imagem')
        .leftJoin('via.colecoes', 'colecao');

    // Filtro por colecaoId (aplicado inicialmente)
    if (colecaoId) {
      qb = qb.andWhere('colecao.id = :colecaoId', { colecaoId });
    }

    // Filtro de busca unificada
    if (unifiedSearch) {
      qb = qb.andWhere(
          '(via.nome LIKE :unifiedSearch OR montanha.nome LIKE :unifiedSearch OR montanha.bairro LIKE :unifiedSearch)',
          { unifiedSearch: `%${unifiedSearch}%` }
      );
    }

    // Filtro por bairro da montanha
    if (bairro) {
      qb = qb.andWhere('montanha.bairro = :bairro', { bairro });
    }

    // Filtro por nome da montanha
    if (selectedMountain) {
      qb = qb.andWhere('montanha.nome = :selectedMountain', { selectedMountain });
    }

    // Filtro por dificuldade da via
    if (selectedDifficulty) {
      qb = qb.andWhere('via.grau = :selectedDifficulty', { selectedDifficulty });
    }

    // Filtro por crux da via
    if (selectedCrux) {
      qb = qb.andWhere('via.crux = :selectedCrux', { selectedCrux });
    }

    // Filtro por categoria de extensão
    if (selectedExtensionCategory) {
      qb = qb.andWhere('via.extensao >= :minExtension AND via.extensao <= :maxExtension', {
        minExtension: selectedExtensionCategory[0],
        maxExtension: selectedExtensionCategory[1]
      });
    }

    // Filtro por exposição
    if (selectedExposicao) {
      if (selectedExposicao[0] === 'e1' && selectedExposicao[1] === 'e2') {
        qb = qb.andWhere('LOWER(via.exposicao) IN (:...selectedExposicao)', { selectedExposicao: selectedExposicao });
      } else {
        qb = qb.andWhere('via.exposicao = :selectedExposicao', { selectedExposicao: selectedExposicao.toLowerCase() });
      }
    }

    // Contar o total de itens
    const totalItems = await qb.getCount();

    // Buscar itens paginados
    const items = await qb
        .skip((page - 1) * itemsPerPage)
        .take(itemsPerPage)
        .getMany();

    // Calcular total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      items,
      totalPages,
      totalItems
    };
  }
}
