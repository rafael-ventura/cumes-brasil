import { Via } from '../../Domain/entities/Via';
import { AppDataSource } from '../config/db';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ViaColecao } from '../../Domain/entities/ViaColecao';

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
    const subQuery = AppDataSource.getRepository(ViaColecao)
      .createQueryBuilder('via_colecao')
      .select('via_colecao.viaId')
      .where('via_colecao.colecaoId = :colecaoId', { colecaoId });

    const [vias, total] = await this.repository.createQueryBuilder('via')
      .where(`via.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
      .leftJoinAndSelect('via.fonte', 'fonte')
      .leftJoinAndSelect('via.face', 'face')
      .leftJoinAndSelect('via.imagem', 'imagem')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      vias: vias as Via[],
      total
    };
  }

  async getViasNotInColecaoId(colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    const subQuery = this.repository
        .createQueryBuilder('via_colecao')
        .select('via_colecao.viaId')  // Referência direta à coluna de chave estrangeira 'viaId'
        .where('via_colecao.colecaoId = :colecaoId', { colecaoId });  // Referência direta à coluna de chave estrangeira 'colecaoId'

    const [vias, total] = await this.repository.createQueryBuilder('via')
        .where(`via.id NOT IN (${subQuery.getQuery()})`)
        .setParameters(subQuery.getParameters())
        .leftJoinAndSelect('via.montanha', 'montanha')
        .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
        .leftJoinAndSelect('via.fonte', 'fonte')
        .leftJoinAndSelect('via.face', 'face')
        .leftJoinAndSelect('via.imagem', 'imagem')
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

  async search(query: any): Promise<ISearchResult<any>> {
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
      itemsPerPage = 10,
      sortField,
      sortOrder
    } = query;

    let qb = this.repository.createQueryBuilder('via')
      .leftJoinAndSelect('via.montanha', 'montanha')
      .leftJoinAndSelect('via.imagem', 'imagem');

    // Filtro por colecaoId (aplicado inicialmente)
    if (colecaoId) {
      qb = qb
        .innerJoin('via.viaColecoes', 'viaColecaoFilter', 'viaColecaoFilter.colecaoId = :colecaoId', { colecaoId })
        .addSelect('viaColecaoFilter.data_adicao', 'data_adicao');
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
        qb = qb.andWhere('via.exposicao LIKE :selectedExposicao', { selectedExposicao: `${selectedExposicao[0]}%` });
      }
    }

    // Adicionar a ordenação com base nos parâmetros sortField e sortOrder
    if (sortField && sortOrder) {
      qb = qb.orderBy(`via.${sortField}`, sortOrder.toUpperCase());
    }

    // Contar o total de itens
    const totalItems = await qb.getCount();

    // Buscar itens paginados
    const items = await qb
      .skip((page - 1) * itemsPerPage)
      .take(itemsPerPage)
      .getRawAndEntities(); // Busca raw data e entidades

    // Mapear os itens para incluir a data_adicao no resultado final
    const mappedItems = items.entities.map((item, index) => {
      const rawData = items.raw[index];
      return {
        ...item,
        data_adicao: rawData.data_adicao || null  // Adicionar a data_adicao ao retorno
      };
    });

    // Calcular total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      items: mappedItems,
      totalPages,
      totalItems
    };
  }

  async countByField(field: string, value: any, operator: string = '='): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('via')
      .leftJoin('via.montanha', 'montanha');

    if (field === 'via.exposicao') {
      // Usar operador LIKE para tratar valores compostos como "E2/3"
      queryBuilder.where(`${field} LIKE :value`, { value: `%${value}%` });
    } else {
      queryBuilder.where(`${field} ${operator} :value`, { value });
    }

    return queryBuilder.getCount();
  }

}
