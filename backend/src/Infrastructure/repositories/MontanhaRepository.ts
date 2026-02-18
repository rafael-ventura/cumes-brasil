import { Service } from 'typedi';
import { Montanha } from "../../Domain/entities/Montanha";
import BaseRepository from "./BaseRepository";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";
import { RepositoryOptions } from './config/RepositoryOptions';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { MontanhaRelationConfig } from './config/MontanhaRelationConfig';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import { SelectQueryBuilder } from 'typeorm';

/**
 * Repository para entidade Montanha.
 * @example
 * ```typescript
 * // Buscar montanha com apenas imagem (LIST)
 * const montanha = await repo.getById(123, { strategy: LoadStrategy.LIST });
 * 
 * // Buscar montanha com localização completa (DETAIL)
 * const montanha = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
 * 
 * // Listar todas as montanhas com imagem
 * const montanhas = await repo.getAll({ strategy: LoadStrategy.LIST });
 * ```
 */
@Service()
export class MontanhaRepository extends BaseRepository<Montanha> implements ICrudRepository<Montanha> {
    protected entityTarget = Montanha;
    
    constructor() {
        super(Montanha);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * 
     * Suporta LoadStrategy (via MontanhaRelationConfig) e relações manuais.
     * 
     * @param queryBuilder - Query Builder do TypeORM
     * @param options - Opções de carregamento
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<Montanha>,
        options?: RepositoryOptions<Montanha>
    ): SelectQueryBuilder<Montanha> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`montanha.${relation}`, relation);
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.LIST;
        return QueryBuilderHelper.applyRelations(queryBuilder, 'montanha', strategy, MontanhaRelationConfig);
    }

    /**
     * Busca montanha por ID.
     * 
     * @param id - ID da montanha
     * @param options - Opções de carregamento
     * @returns Montanha encontrada ou null
     * 
     * @example
     * ```typescript
     * // Sem relações
     * const montanha = await repo.getById(123);
     * 
     * // Com imagem (LIST)
     * const montanha = await repo.getById(123, { strategy: LoadStrategy.LIST });
     * 
     * // Com localização completa (DETAIL)
     * const montanha = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
     * ```
     */
    async getById(id: number, options?: RepositoryOptions<Montanha>): Promise<Montanha | null> {
        const qb = this.repository.createQueryBuilder("montanha")
            .where("montanha.id = :id", { id });
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Lista todas as montanhas.
     * 
     * @param options - Opções de carregamento
     * @returns Array de montanhas
     * 
     * @example
     * ```typescript
     * // Todas sem relações
     * const montanhas = await repo.getAll();
     * 
     * // Com imagem para exibição em cards
     * const montanhas = await repo.getAll({ strategy: LoadStrategy.LIST });
     * ```
     */
    async getAll(options?: RepositoryOptions<Montanha>): Promise<Montanha[]> {
        const qb = this.repository.createQueryBuilder("montanha");
        return this.applyRelationsFromOptions(qb, options).getMany();
    }
}
