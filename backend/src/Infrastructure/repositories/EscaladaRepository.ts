import { Service } from 'typedi';
import { SelectQueryBuilder, QueryRunner } from 'typeorm';
import { Escalada } from '../../Domain/entities/Escalada';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { RepositoryOptions } from './config/RepositoryOptions';
import { EscaladaRelationConfig } from './config/EscaladaRelationConfig';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import BaseRepository from './BaseRepository';

/**
 * Repository para entidade Escalada.
 */
@Service()
export class EscaladaRepository 
    extends BaseRepository<Escalada> 
    implements ISearchRepository<Escalada>, ICrudRepository<Escalada> {
    protected entityTarget = Escalada;
    
    private readonly USER_SAFE_SELECT = [
        "usuario.id", 
        "usuario.nome", 
        "usuario.email",
        "usuario.data_atividade", 
        "usuario.clube_organizacao", 
        "usuario.localizacao",
        "usuario.biografia",
        "usuario.created_at",
        "usuario.updated_at"
        // EXCLUÍDOS (segurança): password_hash, resetPasswordToken, resetPasswordUrl
    ];

    constructor() {
        super(Escalada);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * Suporta seleção parcial de campos do usuário para otimização de performance.
     * 
     * @param queryBuilder - Query Builder do TypeORM
     * @param options - Opções de carregamento (strategy ou relations)
     * @param usePartialUserSelect - Se true, carrega apenas campos essenciais do usuário
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<Escalada>,
        options?: RepositoryOptions<Escalada>,
        usePartialUserSelect = false
    ): SelectQueryBuilder<Escalada> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                if (relation === 'usuario' && usePartialUserSelect) {
                    queryBuilder.leftJoin('escalada.usuario', 'usuario');
                    queryBuilder.addSelect(this.USER_SAFE_SELECT);
                } else {
                    queryBuilder.leftJoinAndSelect(`escalada.${relation}`, relation);
                }
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.LIST;
        
        if (usePartialUserSelect && (strategy === LoadStrategy.LIST || strategy === LoadStrategy.MINIMAL)) {
            if (strategy === LoadStrategy.LIST) {
                queryBuilder.leftJoin('escalada.usuario', 'usuario');
                queryBuilder.addSelect(this.USER_SAFE_SELECT);
                
                queryBuilder.leftJoin('escalada.via', 'via');
                queryBuilder.addSelect(["via.id", "via.nome"]);
                
                queryBuilder.leftJoinAndSelect("escalada.participantes", "participante");
            }
            return queryBuilder;
        }

        return QueryBuilderHelper.applyRelations(
            queryBuilder, 
            'escalada', 
            strategy, 
            EscaladaRelationConfig
        );
    }

    /**
     * Busca escalada por ID.
     * 
     * @param id - ID da escalada
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * // Detalhes completos
     * const escalada = await repo.getById(123, { strategy: LoadStrategy.DETAIL });
     * 
     * // Apenas básico
     * const escalada = await repo.getById(123, { strategy: LoadStrategy.MINIMAL });
     * ```
     */
    async getById(id: number, options?: RepositoryOptions<Escalada>): Promise<Escalada | null> {
        const qb = this.repository.createQueryBuilder("escalada")
            .where("escalada.id = :id", { id });
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Busca todas as escaladas ordenadas por data (mais recentes primeiro).
     * 
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * // Listagem otimizada (seleção parcial de usuário)
     * const escaladas = await repo.getAll({ strategy: LoadStrategy.LIST });
     * ```
     */
    async getAll(options?: RepositoryOptions<Escalada>): Promise<Escalada[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        const qb = this.repository.createQueryBuilder("escalada")
            .orderBy("escalada.data", "DESC");

        return this.applyRelationsFromOptions(qb, effectiveOptions, true).getMany();
    }

    /**
     * Cria nova escalada.
     * 
     * @param escaladaData - Dados da escalada
     * @returns Escalada criada com ID gerado
     * 
     * @example
     * ```typescript
     * const escalada = await repo.create({
     *   usuarioId: 1,
     *   viaId: 42,
     *   data: new Date(),
     *   observacao: "Primeira vez!"
     * });
     * ```
     */
    async create(escaladaData: Partial<Escalada>, queryRunner?: QueryRunner): Promise<Escalada> {
        if (queryRunner) {
            return await queryRunner.manager.save(Escalada, escaladaData);
        }
        return await this.repository.save(escaladaData);
    }

    /**
     * Atualiza escalada existente.
     * 
     * @param id - ID da escalada
     * @param escaladaData - Dados para atualizar
     * 
     * @example
     * ```typescript
     * await repo.update(123, {
     *   observacao: "Melhorei a observação"
     * });
     * ```
     */
    async update(id: number, escaladaData: Partial<Escalada>, queryRunner?: QueryRunner): Promise<void> {
        if (queryRunner) {
            await queryRunner.manager.update(Escalada, id, escaladaData);
        } else {
            await this.repository.update(id, escaladaData);
        }
    }

    /**
     * Deleta escalada por ID.
     * 
     * @param id - ID da escalada
     * 
     * @example
     * ```typescript
     * await repo.delete(123);
     * ```
     */
    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Salva escalada (create ou update automático).
     * 
     * LEGACY: Método mantido para compatibilidade com código existente.
     * Novo código deve usar create() ou update() explicitamente.
     * 
     * @param escalada - Escalada a salvar
     * @returns Escalada salva
     */
    async save(escalada: Partial<Escalada> | Escalada): Promise<Escalada> {
        return await this.repository.save(escalada);
    }

    /**
     * Remove escalada (por entidade).
     * 
     * LEGACY: Método mantido para compatibilidade com código existente.
     * Novo código deve usar delete(id) que é mais performático.
     * 
     * @param escalada - Entidade a remover
     */
    async remove(escalada: Escalada): Promise<void> {
        await this.repository.remove(escalada);
    }

    /**
     * Busca escaladas de um usuário específico.
     * 
     * @param usuarioId - ID do usuário
     * @param options - Opções de carregamento
     * @returns Escaladas do usuário ordenadas por data DESC
     * 
     * @example
     * ```typescript
     * // Histórico de escaladas do usuário
     * const minhasEscaladas = await repo.getByUsuarioId(123, { strategy: LoadStrategy.LIST });
     * ```
     */
    async getByUsuarioId(
        usuarioId: number, 
        options?: RepositoryOptions<Escalada>
    ): Promise<Escalada[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        const qb = this.repository.createQueryBuilder("escalada")
            .where('escalada.usuarioId = :usuarioId', { usuarioId })
            .orderBy("escalada.data", "DESC");

        return this.applyRelationsFromOptions(qb, effectiveOptions, true).getMany();
    }

    /**
     * Busca escaladas de uma via específica.
     * 
     * @param viaId - ID da via
     * @param limit - Número máximo de resultados (opcional)
     * @param options - Opções de carregamento
     * @returns Escaladas da via ordenadas por data DESC
     * 
     * @example
     * ```typescript
     * // 10 últimas escaladas de uma via
     * const escaladas = await repo.getByViaId(42, 10, { strategy: LoadStrategy.LIST });
     * ```
     */
    async getByViaId(
        viaId: number, 
        limit?: number, 
        options?: RepositoryOptions<Escalada>
    ): Promise<Escalada[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        const qb = this.repository.createQueryBuilder("escalada")
            .where("escalada.viaId = :viaId", { viaId })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            qb.limit(limit);
        }
        
        return this.applyRelationsFromOptions(qb, effectiveOptions, true).getMany();
    }

    /**
     * Busca escaladas de um usuário em uma via específica.
     * Útil para verificar se usuário já escalou determinada via e quantas vezes.
     * 
     * @param usuarioId - ID do usuário
     * @param viaId - ID da via
     * @param limit - Número máximo de resultados (opcional)
     * @param options - Opções de carregamento
     * @returns Escaladas do usuário naquela via ordenadas por data DESC
     * 
     * @example
     * ```typescript
     * // Quantas vezes o usuário escalou a via?
     * const repeticoes = await repo.getByViaIdAndByUser(123, 42, undefined, { strategy: LoadStrategy.MINIMAL });
     * console.log(`Escalou ${repeticoes.length} vez(es)`);
     * ```
     */
    async getByViaIdAndByUser(
        usuarioId: number, 
        viaId: number, 
        limit?: number, 
        options?: RepositoryOptions<Escalada>
    ): Promise<Escalada[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        const qb = this.repository.createQueryBuilder("escalada")
            .where('escalada.usuarioId = :usuarioId AND escalada.viaId = :viaId', { usuarioId, viaId })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            qb.limit(limit);
        }

        return this.applyRelationsFromOptions(qb, effectiveOptions, true).getMany();
    }

    /**
     * Busca paginada de escaladas com filtros.
     *
     * @param filters - Filtros de busca
     * @returns Resultado paginado com items, totalPages, totalItems
     * 
     * @example
     * ```typescript
     * const result = await repo.search({
     *   usuarioId: 123,
     *   unifiedSearch: "Diedro",
     *   page: 1,
     *   itemsPerPage: 20
     * });
     * 
     * console.log(`Encontradas ${result.totalItems} escaladas`);
     * result.items.forEach(escalada => {
     *   console.log(`- ${escalada.via.nome} em ${escalada.data}`);
     * });
     * ```
     */
    async search(filters: any): Promise<ISearchResult<Escalada>> {
        const {
            unifiedSearch,
            page = 1,
            usuarioId,
            itemsPerPage = 10
        } = filters;

        let qb = this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuario", "usuario")
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.imagem", "imagem")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        if (usuarioId) {
            qb = qb.andWhere('escalada.usuario.id = :usuarioId', { usuarioId });
        }

        if (unifiedSearch) {
            qb = qb.andWhere("via.nome LIKE :unifiedSearch", { 
                unifiedSearch: `%${unifiedSearch}%` 
            });
        }

        const totalItems = await qb.getCount();

        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getMany();

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            items,
            totalPages,
            totalItems
        };
    }
}
