import { Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { ViaCroqui } from "../../Domain/entities/ViaCroqui";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import BaseRepository from "./BaseRepository";
import { RepositoryOptions } from './config/RepositoryOptions';
import { ViaCroquiRelationConfig } from './config/ViaCroquiRelationConfig';

/**
 * Repository para entidade ViaCroqui (tabela de junção Via-Croqui).
 */
@Service()
export class ViaCroquiRepository 
    extends BaseRepository<ViaCroqui> 
    implements ICrudRepository<ViaCroqui> {
    protected entityTarget = ViaCroqui;
    
    constructor() {
        super(ViaCroqui);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * 
     * @param queryBuilder - Query Builder do TypeORM
     * @param options - Opções de carregamento (strategy ou relations)
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<ViaCroqui>,
        options?: RepositoryOptions<ViaCroqui>
    ): SelectQueryBuilder<ViaCroqui> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`via_croqui.${relation}`, relation);
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.LIST;
        return QueryBuilderHelper.applyRelations(
            queryBuilder, 
            'via_croqui', 
            strategy, 
            ViaCroquiRelationConfig
        );
    }

    /**
     * Busca associação por ID.
     * 
     * @param id - ID da associação
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * // Sem relações
     * const assoc = await repo.getById(123);
     * 
     * // Com via e croqui
     * const assoc = await repo.getById(123, { strategy: LoadStrategy.LIST });
     * ```
     */
    async getById(id: number, options?: RepositoryOptions<ViaCroqui>): Promise<ViaCroqui | null> {
        const qb = this.repository.createQueryBuilder("via_croqui")
            .where("via_croqui.id = :id", { id });
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Lista todas as associações.
     * 
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * const all = await repo.getAll({ strategy: LoadStrategy.LIST });
     * ```
     */
    async getAll(options?: RepositoryOptions<ViaCroqui>): Promise<ViaCroqui[]> {
        const qb = this.repository.createQueryBuilder("via_croqui");
        return this.applyRelationsFromOptions(qb, options).getMany();
    }

    /**
     * Associa uma via a um croqui.
     * Método específico para manter compatibilidade com código existente.
     * @param viaCroquiData - Dados da associação (via.id e croqui.id)
     * 
     * @example
     * ```typescript
     * await repo.associar({ 
     *   via: { id: 123 }, 
     *   croqui: { id: 456 } 
     * });
     * ```
     */
    async associar(viaCroquiData: { via: { id: number }, croqui: { id: number } }): Promise<void> {
        const viaCroqui = this.repository.create(viaCroquiData);
        await this.repository.insert(viaCroqui);
    }

    /**
     * Desassocia uma via de um croqui.
     * @param croquiId - ID do croqui
     * @param viaId - ID da via
     * 
     * @example
     * ```typescript
     * await repo.desassociar(123, 456);
     * ```
     */
    async desassociar(croquiId: number, viaId: number): Promise<void> {
        await this.repository.delete({ 
            via: { id: viaId }, 
            croqui: { id: croquiId } 
        });
    }

    // create/update/delete herdados de BaseRepository
}
