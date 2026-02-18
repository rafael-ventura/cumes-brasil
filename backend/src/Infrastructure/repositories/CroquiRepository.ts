import { Service } from 'typedi';
import { Croqui } from "../../Domain/entities/Croqui";
import BaseRepository from "./BaseRepository";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";
import { RepositoryOptions } from './config/RepositoryOptions';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { CroquiRelationConfig } from './config/CroquiRelationConfig';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import { SelectQueryBuilder } from 'typeorm';
import { ViaCroquiRepository } from './ViaCroquiRepository';

/**
 * Repository para entidade Croqui.
 *
 * @example
 * ```typescript
 * // Buscar croqui com imagem e fonte (LIST)
 * const croqui = await repo.getById(123, { strategy: LoadStrategy.LIST });
 * 
 * // Buscar croquis de uma via
 * const croquis = await repo.getByViaId(456, { strategy: LoadStrategy.LIST });
 * 
 * // Associar croqui a uma via (delega para ViaCroquiRepository)
 * await repo.associarVia(123, 456);
 * ```
 */
@Service()
export class CroquiRepository extends BaseRepository<Croqui> implements ICrudRepository<Croqui> {
  protected entityTarget = Croqui;
  
  /**
   * Constructor com Dependency Injection.
   * 
   * @param viaCroquiRepository - Repository injetado para gerenciar associações via-croqui
   */
  constructor(
    private viaCroquiRepository: ViaCroquiRepository
  ) {
    super(Croqui);
  }

  /**
   * Aplica relações ao Query Builder baseado em RepositoryOptions.
   * 
   * @param queryBuilder - Query Builder do TypeORM
   * @param options - Opções de carregamento
   * @returns Query Builder com joins aplicados
   */
  private applyRelationsFromOptions(
    queryBuilder: SelectQueryBuilder<Croqui>,
    options?: RepositoryOptions<Croqui>
  ): SelectQueryBuilder<Croqui> {
    if (options?.relations && options.relations.length > 0) {
      options.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`croqui.${relation}`, relation);
      });
      return queryBuilder;
    }

    const strategy = options?.strategy ?? LoadStrategy.LIST;
    return QueryBuilderHelper.applyRelations(queryBuilder, 'croqui', strategy, CroquiRelationConfig);
  }

  /**
   * Busca croqui por ID.
   * 
   * @param id - ID do croqui
   * @param options - Opções de carregamento
   * @returns Croqui encontrado ou null
   * 
   * @example
   * ```typescript
   * const croqui = await repo.getById(123, { strategy: LoadStrategy.LIST });
   * ```
   */
  async getById (id: number, options?: RepositoryOptions<Croqui>): Promise<Croqui | null> {
    const qb = this.repository.createQueryBuilder("croqui")
      .where("croqui.id = :id", { id });
    return this.applyRelationsFromOptions(qb, options).getOne();
  }
  
  /**
   * Busca múltiplos croquis por IDs.
   * 
   * @param ids - Array de IDs dos croquis
   * @param options - Opções de carregamento
   * @returns Array de croquis
   * 
   * @example
   * ```typescript
   * const croquis = await repo.getByIds([1, 2, 3], { strategy: LoadStrategy.LIST });
   * ```
   */
  async getByIds (ids: number[], options?: RepositoryOptions<Croqui>): Promise<Croqui[]> {
    const qb = this.repository.createQueryBuilder("croqui")
      .where("croqui.id IN (:...ids)", { ids });
    return this.applyRelationsFromOptions(qb, options).getMany();
  }

  /**
   * Lista todos os croquis.
   * 
   * @param options - Opções de carregamento
   * @returns Array de croquis
   * 
   * @example
   * ```typescript
   * const croquis = await repo.getAll({ strategy: LoadStrategy.LIST });
   * ```
   */
  async getAll (options?: RepositoryOptions<Croqui>): Promise<Croqui[]> {
    const qb = this.repository.createQueryBuilder("croqui");
    return this.applyRelationsFromOptions(qb, options).getMany();
  }

  /**
   * Busca apenas IDs de croquis associados a uma via.
   * 
   * Otimização: Retorna apenas IDs ao invés de entidades completas.
   * 
   * @param via_id - ID da via
   * @returns Array de IDs de croquis ou null
   * 
   * @example
   * ```typescript
   * const ids = await repo.getIdsByViaId(123); // [1, 2, 3]
   * ```
   */
  async getIdsByViaId (via_id: number): Promise<number[] | null> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoin("croqui.viaCroquis", "viaCroquis")
      .leftJoin("viaCroquis.via", "via")
      .where("via.id = :via_id", { via_id })
      .select("croqui.id")
      .getRawMany()
      .then((croquis) => croquis.map(croqui => croqui.id));
  }

  /**
   * Busca croquis associados a uma via.
   * 
   * @param via_id - ID da via
   * @param options - Opções de carregamento
   * @returns Array de croquis
   * 
   * @example
   * ```typescript
   * const croquis = await repo.getByViaId(123, { strategy: LoadStrategy.LIST });
   * ```
   */
  async getByViaId(via_id: number, options?: RepositoryOptions<Croqui>): Promise<Croqui[]> {
    const qb = this.repository.createQueryBuilder("croqui")
        .leftJoin("croqui.viaCroquis", "viaCroquis")
        .leftJoin("viaCroquis.via", "via")
        .where("via.id = :via_id", { via_id });
    return this.applyRelationsFromOptions(qb, options).getMany();
  }

  /**
   * Associa um croqui a uma via.
   * 
   * @param croqui_id - ID do croqui
   * @param via_id - ID da via
   * 
   * @example
   * ```typescript
   * await repo.associarVia(123, 456);
   * ```
   */
  async associarVia (croqui_id: number, via_id: number): Promise<void> {
    await this.viaCroquiRepository.associar({ 
      via: { id: via_id }, 
      croqui: { id: croqui_id } 
    });
  }

  /**
   * Desassocia um croqui de uma via.
   * 
   * @param croqui_id - ID do croqui
   * @param via_id - ID da via
   * 
   * @example
   * ```typescript
   * await repo.desassociarVia(123, 456);
   * ```
   */
  async desassociarVia (croqui_id: number, via_id: number): Promise<void> {
    await this.viaCroquiRepository.desassociar(via_id, croqui_id);
  }
}

