import { Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import BaseRepository from './BaseRepository';
import { RepositoryOptions } from './config/RepositoryOptions';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { ViaColecaoRelationConfig } from './config/ViaColecaoRelationConfig';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';

/**
 * Repository para entidade ViaColecao (relacionamento many-to-many Via-Colecao).
 * 
 * @example
 * ```typescript
 * // Associar via a coleção (idempotente)
 * await viaColecaoRepo.associar(123, 456);
 * 
 * // Desassociar
 * await viaColecaoRepo.desassociar(123, 456);
 * 
 * // Buscar vias de uma coleção com relações
 * const viaColecoes = await viaColecaoRepo.getByColecaoId(456, { 
 *   strategy: LoadStrategy.LIST 
 * });
 * 
 * // Buscar apenas IDs para queries (performance)
 * const colecaoIds = await viaColecaoRepo.getColecaoIdsByViaId(123);
 * ```
 */
@Service()
export class ViaColecaoRepository extends BaseRepository<ViaColecao> 
    implements ICrudRepository<ViaColecao> {
    protected entityTarget = ViaColecao;
    
    constructor() {
        super(ViaColecao);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * 
     * @param queryBuilder - Query Builder do TypeORM
     * @param options - Opções de carregamento (strategy ou relations)
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<ViaColecao>,
        options?: RepositoryOptions<ViaColecao>
    ): SelectQueryBuilder<ViaColecao> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`via_colecao.${relation}`, relation);
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.LIST;
        return QueryBuilderHelper.applyRelations(
            queryBuilder, 
            'via_colecao', 
            strategy, 
            ViaColecaoRelationConfig
        );
    }

    /**
     * Busca associação por ID.
     * 
     * @param id - ID da associação
     * @param options - Opções de carregamento
     * @returns ViaColecao ou null
     */
    async getById(id: number, options?: RepositoryOptions<ViaColecao>): Promise<ViaColecao | null> {
        const qb = this.repository.createQueryBuilder("via_colecao")
            .where("via_colecao.id = :id", { id });
        
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Busca todas as associações.
     * 
     * @param options - Opções de carregamento
     * @returns Array de ViaColecao
     */
    async getAll(options?: RepositoryOptions<ViaColecao>): Promise<ViaColecao[]> {
        const qb = this.repository.createQueryBuilder("via_colecao");
        return this.applyRelationsFromOptions(qb, options).getMany();
    }

    /**
     * Associa uma via a uma coleção.
     * 
     * Operação idempotente: Se associação já existe, não lança erro.
     * Previne duplicações automaticamente.
     * 
     * @param viaId - ID da via
     * @param colecaoId - ID da coleção
     * 
     * @example
     * ```typescript
     * // Primeira chamada: cria associação
     * await repo.associar(123, 456);
     * 
     * // Segunda chamada: não faz nada (idempotente)
     * await repo.associar(123, 456);
     * ```
     */
    async associar(viaId: number, colecaoId: number): Promise<void> {
        // Previne duplicação (idempotente)
        const exists = await this.repository.findOne({
            where: { 
                via: { id: viaId }, 
                colecao: { id: colecaoId } 
            }
        });
        
        if (exists) {
            return;
        }

        await this.repository.save({
            via: { id: viaId } as any,
            colecao: { id: colecaoId } as any
        });
    }

    /**
     * Desassocia uma via de uma coleção.
     * Operação idempotente: Não lança erro se associação não existe.
     * 
     * @param viaId - ID da via
     * @param colecaoId - ID da coleção
     * 
     * @example
     * ```typescript
     * await repo.desassociar(123, 456);
     * ```
     */
    async desassociar(viaId: number, colecaoId: number): Promise<void> {
        await this.repository.delete({
            via: { id: viaId },
            colecao: { id: colecaoId }
        });
    }

    /**
     * Busca todas as associações de uma coleção específica.
     * 
     * @param colecaoId - ID da coleção
     * @param options - Opções de carregamento
     * @returns Array de ViaColecao com relações
     * 
     * @example
     * ```typescript
     * // Com via + montanha + imagem carregadas
     * const viaColecoes = await repo.getByColecaoId(456, { 
     *   strategy: LoadStrategy.LIST 
     * });
     * 
     * // Apenas dados da tabela via_colecao
     * const viaColecoes = await repo.getByColecaoId(456, { 
     *   strategy: LoadStrategy.MINIMAL 
     * });
     * ```
     */
    async getByColecaoId(
        colecaoId: number, 
        options?: RepositoryOptions<ViaColecao>
    ): Promise<ViaColecao[]> {
        const qb = this.repository.createQueryBuilder("via_colecao")
            .where("via_colecao.colecao.id = :colecaoId", { colecaoId });
        
        return this.applyRelationsFromOptions(qb, options).getMany();
    }

    /**
     * Busca todas as associações de uma via específica.
     * 
     * @param viaId - ID da via
     * @param options - Opções de carregamento
     * @returns Array de ViaColecao com relações
     * 
     * @example
     * ```typescript
     * // Buscar todas as coleções que contêm a via
     * const viaColecoes = await repo.getByViaId(123, { 
     *   strategy: LoadStrategy.DETAIL 
     * });
     * ```
     */
    async getByViaId(
        viaId: number, 
        options?: RepositoryOptions<ViaColecao>
    ): Promise<ViaColecao[]> {
        const qb = this.repository.createQueryBuilder("via_colecao")
            .where("via_colecao.via.id = :viaId", { viaId });
        
        return this.applyRelationsFromOptions(qb, options).getMany();
    }

    /**
     * Retorna apenas IDs de coleções que contêm a via especificada.
     * Performance: Otimizado para subqueries (SELECT apenas IDs, sem joins).
     * Use quando não precisa dos dados completos das coleções.
     * 
     * @param viaId - ID da via
     * @returns Array de IDs de coleções
     * 
     * @example
     * ```typescript
     * const colecaoIds = await repo.getColecaoIdsByViaId(123);
     * // Retorno: [1, 5, 7, 12]
     * 
     * // Usar em subquery:
     * const colecoesNaoContem = await colecaoRepo.createQueryBuilder('colecao')
     *   .where('colecao.id NOT IN (:...ids)', { ids: colecaoIds })
     *   .getMany();
     * ```
     */
    async getColecaoIdsByViaId(viaId: number): Promise<number[]> {
        const results = await this.repository.createQueryBuilder("via_colecao")
            .select("via_colecao.colecaoId", "colecaoId")
            .where("via_colecao.viaId = :viaId", { viaId })
            .getRawMany();
        
        return results.map(r => r.colecaoId);
    }

    /**
     * Retorna apenas IDs de vias que estão na coleção especificada.
     * Performance: Otimizado para subqueries (SELECT apenas IDs, sem joins).
     * 
     * @param colecaoId - ID da coleção
     * @returns Array de IDs de vias
     * 
     * @example
     * ```typescript
     * const viaIds = await repo.getViaIdsByColecaoId(456);
     * // Retorno: [10, 20, 30, 40]
     * ```
     */
    async getViaIdsByColecaoId(colecaoId: number): Promise<number[]> {
        const results = await this.repository.createQueryBuilder("via_colecao")
            .select("via_colecao.viaId", "viaId")
            .where("via_colecao.colecaoId = :colecaoId", { colecaoId })
            .getRawMany();
        
        return results.map(r => r.viaId);
    }

    /**
     * Conta quantas vias estão em uma coleção.
     * 
     * @param colecaoId - ID da coleção
     * @returns Número de vias
     * 
     * @example
     * ```typescript
     * const total = await repo.countViasInColecao(456);
     * // Retorno: 15
     * ```
     */
    async countViasInColecao(colecaoId: number): Promise<number> {
        return this.repository.count({
            where: { colecao: { id: colecaoId } }
        });
    }

    /**
     * Conta em quantas coleções uma via está presente.
     * 
     * @param viaId - ID da via
     * @returns Número de coleções
     * 
     * @example
     * ```typescript
     * const total = await repo.countColecoesWithVia(123);
     * // Retorno: 3
     * ```
     */
    async countColecoesWithVia(viaId: number): Promise<number> {
        return this.repository.count({
            where: { via: { id: viaId } }
        });
    }

    /**
     * Remove todas as associações de uma coleção.
     * Útil antes de deletar uma coleção (CASCADE manual).
     * 
     * @param colecaoId - ID da coleção
     * @returns Número de associações removidas
     * 
     * @example
     * ```typescript
     * // Antes de deletar coleção
     * const removed = await repo.removeAllFromColecao(456);
     * console.log(`${removed} vias removidas da coleção`);
     * ```
     */
    async removeAllFromColecao(colecaoId: number): Promise<number> {
        const result = await this.repository.delete({
            colecao: { id: colecaoId }
        });
        
        return result.affected || 0;
    }

    /**
     * Remove todas as associações de uma via.
     * Útil antes de deletar uma via (CASCADE manual).
     * 
     * @param viaId - ID da via
     * @returns Número de associações removidas
     * 
     * @example
     * ```typescript
     * // Antes de deletar via
     * const removed = await repo.removeAllFromVia(123);
     * console.log(`Via removida de ${removed} coleções`);
     * ```
     */
    async removeAllFromVia(viaId: number): Promise<number> {
        const result = await this.repository.delete({
            via: { id: viaId }
        });
        
        return result.affected || 0;
    }
}
