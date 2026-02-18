import { Service } from 'typedi';
import { Face } from "../../Domain/entities/Face";
import BaseRepository from "./BaseRepository";
import { RepositoryOptions } from './config/RepositoryOptions';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { FaceRelationConfig } from './config/FaceRelationConfig';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import { SelectQueryBuilder } from 'typeorm';

/**
 * Repository para entidade Face.
 * @example
 * ```typescript
 * // Buscar face com montanha (LIST)
 * const face = await repo.getById(123, { strategy: LoadStrategy.LIST });
 * 
 * // Buscar face com montanha + fonte + localização (DETAIL)
 * const face = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
 * 
 * // Listar todas as faces com montanha
 * const faces = await repo.getAll({ strategy: LoadStrategy.LIST });
 * ```
 */
@Service()
export class FaceRepository extends BaseRepository<Face> {
    protected entityTarget = Face;
    
    constructor() {
        super(Face);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * 
     * @param queryBuilder - Query Builder do TypeORM
     * @param options - Opções de carregamento
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<Face>,
        options?: RepositoryOptions<Face>
    ): SelectQueryBuilder<Face> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`face.${relation}`, relation);
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.LIST;
        return QueryBuilderHelper.applyRelations(queryBuilder, 'face', strategy, FaceRelationConfig);
    }

    /**
     * Busca face por ID.
     * 
     * @param id - ID da face
     * @param options - Opções de carregamento
     * @returns Face encontrada ou null
     * 
     * @example
     * ```typescript
     * // Sem relações
     * const face = await repo.getById(123);
     * 
     * // Com montanha (LIST)
     * const face = await repo.getById(123, { strategy: LoadStrategy.LIST });
     * 
     * // Com montanha + fonte + localização (DETAIL)
     * const face = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
     * ```
     */
    async getById(id: number, options?: RepositoryOptions<Face>): Promise<Face | null> {
        const qb = this.repository.createQueryBuilder("face")
            .where("face.id = :id", { id });
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Lista todas as faces.
     * 
     * @param options - Opções de carregamento
     * @returns Array de faces
     * 
     * @example
     * ```typescript
     * // Todas sem relações
     * const faces = await repo.getAll();
     * 
     * // Com montanha para contexto
     * const faces = await repo.getAll({ strategy: LoadStrategy.LIST });
     * ```
     */
    async getAll(options?: RepositoryOptions<Face>): Promise<Face[]> {
        const qb = this.repository.createQueryBuilder("face");
        return this.applyRelationsFromOptions(qb, options).getMany();
    }

    // create/update/delete herdados do BaseRepository
}
