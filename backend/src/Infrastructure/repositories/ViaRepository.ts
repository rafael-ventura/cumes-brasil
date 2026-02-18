import { Via } from '../../Domain/entities/Via';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { ViaRelationConfig } from './config/ViaRelationConfig';
import { SelectQueryBuilder, QueryRunner } from 'typeorm';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import { RepositoryOptions } from './config/RepositoryOptions';
import { Service } from 'typedi';
import { ViaColecaoRepository } from './ViaColecaoRepository';

@Service()
export class ViaRepository extends BaseRepository<Via> implements ISearchRepository<Via>, ICrudRepository<Via> {
    protected entityTarget = Via;
    
    constructor(
        private viaColecaoRepository: ViaColecaoRepository
    ) {
        super(Via);
    }

    /**
     * Aplica relações ao Query Builder baseado em RepositoryOptions.
     * Suporta tanto LoadStrategy (via QueryBuilderHelper) quanto relações manuais.

     * @param qb - Query Builder do TypeORM
     * @param options - Opções de carregamento (strategy ou relations)
     * @returns Query Builder com joins aplicados
     */
    private applyRelationsFromOptions(
        qb: SelectQueryBuilder<Via>,
        options?: RepositoryOptions<Via>
    ): SelectQueryBuilder<Via> {
        if (options?.relations) {
            options.relations.forEach(rel => {
                const alias = rel.replace(/\./g, '_');
                qb.leftJoinAndSelect(`via.${rel}`, alias);
            });
            return qb;
        }
        
        if (options?.strategy) {
            return QueryBuilderHelper.applyRelations(qb, 'via', options.strategy, ViaRelationConfig);
        }
        
        return qb;
    }

    /**
     * Busca via por ID com API options-based.
     * @param id - ID da via
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * // Sem relações (MINIMAL)
     * const via = await viaRepo.getById(123);
     * 
     * // Com estratégia DETAIL (50+ joins para página de detalhes)
     * const via = await viaRepo.getById(123, { strategy: LoadStrategy.DETAIL });
     * 
     * // Com estratégia LIST (4 joins para listagens)
     * const via = await viaRepo.getById(123, { strategy: LoadStrategy.LIST });
     * 
     * // Relações customizadas para queries específicas
     * const via = await viaRepo.getById(123, { relations: ['montanha', 'face'] });
     * ```
     */
    async getById(id: number, options?: RepositoryOptions<Via>): Promise<Via | null> {
        const qb = this.repository
            .createQueryBuilder("via")
            .where("via.id = :id", { id });
        
        return this.applyRelationsFromOptions(qb, options).getOne();
    }

    /**
     * Busca paginada de vias com API options-based.
     * @param page - Número da página (1-indexed)
     * @param limit - Itens por página
     * @param options - Opções de carregamento
     * 
     * @example
     * ```typescript
     * // Listagem padrão: LIST strategy (montanha, face, setor, imagem)
     * const result = await viaRepo.getAllPaginated(1, 20);
     * 
     * // Detalhamento: DETAIL strategy (50+ joins)
     * const result = await viaRepo.getAllPaginated(1, 20, { strategy: LoadStrategy.DETAIL });
     * 
     * // Minimal: sem joins (ideal para autocomplete)
     * const result = await viaRepo.getAllPaginated(1, 20, { strategy: LoadStrategy.MINIMAL });
     * ```
     */
    async getAllPaginated(
        page: number,
        limit: number,
        options?: RepositoryOptions<Via>
    ): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const qb = this.repository.createQueryBuilder("via");
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        
        const [vias, total] = await this.applyRelationsFromOptions(qb, effectiveOptions)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Busca todas as vias sem paginação (usar com cuidado - pode retornar muitos dados).
     * 
     * @param options - Opções de carregamento (default: LIST)
     */
    async getAllWithoutPagination(
        options?: RepositoryOptions<Via>
    ): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const qb = this.repository.createQueryBuilder("via");
        
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        
        const [vias, total] = await this.applyRelationsFromOptions(qb, effectiveOptions)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: 1,
        };
    }

    /**
     * Busca via aleatória (para "Inspire-se").
     * 
     * @param options - Opções de carregamento (default: LIST)
     */
    async getRandom(options?: RepositoryOptions<Via>): Promise<Via | null> {
        const qb = this.repository.createQueryBuilder("via").orderBy("RANDOM()");
        
        const effectiveOptions = options || { strategy: LoadStrategy.LIST };
        
        return this.applyRelationsFromOptions(qb, effectiveOptions).getOne();
    }

    /**
     * Cria nova via e recarrega com relações.
     * 
     * @param via - Dados da via
     * @param queryRunner - Query runner opcional para transações
     * @param reloadOptions - Opções de recarregamento (default: DETAIL)
     */
    async create(via: Partial<Via>, queryRunner?: QueryRunner, reloadOptions?: RepositoryOptions<Via>): Promise<Via> {
        let id: number;
        
        if (queryRunner) {
            const result = await queryRunner.manager.save(Via, via);
            id = result.id;
        } else {
            const insertResult = await this.repository.insert(via);
            id = insertResult.identifiers[0].id;
        }
        
        const effectiveOptions = reloadOptions || { strategy: LoadStrategy.DETAIL };
        
        return this.getById(id, effectiveOptions) as Promise<Via>;
    }

    /**
     * Atualiza via e recarrega com relações.
     * 
     * @param id - ID da via
     * @param viaData - Dados para atualizar
     * @param queryRunner - Query runner opcional para transações
     * @param reloadOptions - Opções de recarregamento (default: DETAIL)
     */
    async updateVia(
        id: number,
        viaData: Partial<Via>,
        queryRunner?: QueryRunner,
        reloadOptions?: RepositoryOptions<Via>
    ): Promise<Via | null> {
        if (queryRunner) {
            await queryRunner.manager.update(Via, id, viaData);
        } else {
            await this.repository.update(id, viaData);
        }
        
        const effectiveOptions = reloadOptions || { strategy: LoadStrategy.DETAIL };
        
        return this.getById(id, effectiveOptions);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Busca vias de uma coleção específica.
     * 
     * @param colecaoId - ID da coleção
     * @param page - Número da página
     * @param limit - Itens por página
     * @param options - Opções de carregamento (default: LIST)
     */
    async getViasByColecaoId(
        colecaoId: number,
        page: number,
        limit: number,
        options?: RepositoryOptions<Via>
    ): Promise<{
        items: Via[],
        total: number,
        totalPages: number
    }> {
        const viaIds = await this.getViaIdsByColecaoId(colecaoId);

        if (viaIds.length === 0) {
            return { items: [], total: 0, totalPages: 0 };
        }

        const qb = this.repository.createQueryBuilder("via")
            .where("via.id IN (:...viaIds)", { viaIds });

        const effectiveOptions = options || { strategy: LoadStrategy.LIST };

        const [vias, total] = await this.applyRelationsFromOptions(qb, effectiveOptions)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    private async getViaIdsByColecaoId(colecaoId: number): Promise<number[]> {
        const viaColecoes = await this.viaColecaoRepository['repository']
            .createQueryBuilder('vc')
            .select('vc.viaId')
            .where('vc.colecaoId = :colecaoId', { colecaoId })
            .getRawMany();
        
        return viaColecoes.map(vc => vc.viaId);
    }

    /**
     * Busca vias que NÃO estão em uma coleção do usuário.
     * 
     * @param colecaoId - ID da coleção
     * @param usuarioId - ID do usuário
     * @param page - Número da página
     * @param limit - Itens por página
     * @param options - Opções de carregamento (default: LIST)
     */
    async getViasNotInColecaoForUser(
        colecaoId: number,
        usuarioId: number,
        page: number,
        limit: number,
        options?: RepositoryOptions<Via>
    ): Promise<{
        items: Via[],
        total: number,
        totalPages: number
    }> {
        const viaIdsInColecao = await this.getViaIdsByColecaoId(colecaoId);

        const qb = this.repository.createQueryBuilder("via");
        
        if (viaIdsInColecao.length > 0) {
            qb.where("via.id NOT IN (:...viaIdsInColecao)", { viaIdsInColecao });
        }

        const effectiveOptions = options || { strategy: LoadStrategy.LIST };

        const [vias, total] = await this.applyRelationsFromOptions(qb, effectiveOptions)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: vias,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Busca complexa de vias com filtros avançados.
     * 
     * @param query - Parâmetros de busca
     * @param options - Opções de carregamento (default: DETAIL para suportar filtros de localização)
     */
    async search(query: any, options?: RepositoryOptions<Via>): Promise<ISearchResult<any>> {
        const {
            unifiedSearch,
            selectedMountain,
            selectedDifficulty,
            selectedCrux,
            selectedExtensionCategory,
            selectedExposicao,
            colecaoId,
            bairro,
            tipo_rocha,
            tipo_escalada,
            modalidade,
            page = 1,
            itemsPerPage = 10,
            sortField,
            sortOrder,
        } = query;

        const effectiveOptions = options || { strategy: LoadStrategy.DETAIL };
        
        let qb = this.applyRelationsFromOptions(
            this.repository.createQueryBuilder("via"),
            effectiveOptions
        );

        if (colecaoId) {
            qb = qb.innerJoin("via.viaColecoes", "viaColecaoFilter", "viaColecaoFilter.colecaoId = :colecaoId", {colecaoId})
                .addSelect("viaColecaoFilter.data_adicao", "data_adicao");
        }

        if (unifiedSearch) {
            qb = qb.andWhere(
                "(via.nome LIKE :unifiedSearch OR setorBairro.nome LIKE :unifiedSearch OR setorFaceBairro.nome LIKE :unifiedSearch OR setorMontanhaBairro.nome LIKE :unifiedSearch OR faceBairro.nome LIKE :unifiedSearch OR montanhaBairro.nome LIKE :unifiedSearch OR montanha.nome LIKE :unifiedSearch OR faceMontanha.nome LIKE :unifiedSearch OR setorMontanha.nome LIKE :unifiedSearch OR setorFaceMontanha.nome LIKE :unifiedSearch)",
                {unifiedSearch: `%${unifiedSearch}%`}
            );
        }

        if (bairro) {
            qb = qb.andWhere(
                "(LOWER(setorBairro.nome) = :bairro OR LOWER(setorFaceBairro.nome) = :bairro OR LOWER(setorMontanhaBairro.nome) = :bairro OR LOWER(faceBairro.nome) = :bairro OR LOWER(montanhaBairro.nome) = :bairro)",
                {bairro: bairro.toLowerCase()}
            );
        }

        if (selectedMountain) {
            qb = qb.andWhere(
                "(montanha.id = :selectedMountain OR faceMontanha.id = :selectedMountain OR setorMontanha.id = :selectedMountain OR setorFaceMontanha.id = :selectedMountain)",
                { selectedMountain }
            );
        }

        if (selectedDifficulty) {
            qb = qb.andWhere("via.grau = :selectedDifficulty", {selectedDifficulty});
        }

        if (selectedCrux) {
            qb = qb.andWhere("via.crux = :selectedCrux", {selectedCrux});
        }

        if (selectedExtensionCategory) {
            qb = qb.andWhere("via.extensao >= :minExtension AND via.extensao <= :maxExtension", {
                minExtension: selectedExtensionCategory[0],
                maxExtension: selectedExtensionCategory[1],
            });
        }

        if (selectedExposicao) {
            if (selectedExposicao[0] === "e1" && selectedExposicao[1] === "e2") {
                qb = qb.andWhere("LOWER(via.exposicao) IN (:...selectedExposicao)", {selectedExposicao});
            } else {
                qb = qb.andWhere("via.exposicao LIKE :selectedExposicao", {selectedExposicao: `${selectedExposicao[0]}%`});
            }
        }

        if (tipo_rocha) {
            qb = qb.andWhere("LOWER(via.tipo_rocha) LIKE :tipo_rocha", {tipo_rocha: `%${tipo_rocha.toLowerCase()}%`});
        }

        if (tipo_escalada) {
            qb = qb.andWhere("LOWER(via.tipo_escalada) LIKE :tipo_escalada", {tipo_escalada: `%${tipo_escalada.toLowerCase()}%`});
        }

        if (modalidade) {
            qb = qb.andWhere("via.modalidade = :modalidade", {modalidade});
        }

        if (sortField && sortOrder) {
            qb = qb.orderBy(`via.${sortField}`, sortOrder.toUpperCase());
        }

        const totalItems = await qb.getCount();

        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getRawAndEntities();

        const mappedItems = items.entities.map((item, index) => {
            const rawData = items.raw[index];
            return {...item, data_adicao: rawData.data_adicao || null};
        });

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {items: mappedItems, totalPages, totalItems};
    }

    async countByField(field: string, value: any, operator: string = "="): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder("via");

        if (field === "via.exposicao" || field === "via.duracao") {
            queryBuilder.where(`${field} LIKE :value`, {value: `%${value}%`});
        } else {
            queryBuilder.where(`${field} ${operator} :value`, {value});
        }

        return queryBuilder.getCount();
    }

    async countByBairro(bairro: string): Promise<number> {
        return this.repository.createQueryBuilder("via")
            .leftJoin("via.setor", "setor")
            .leftJoin("setor.localizacoes", "setorLocalizacoes")
            .leftJoin("setorLocalizacoes.bairro", "setorBairro")
            .leftJoin("setor.face", "setorFace")
            .leftJoin("setorFace.localizacoes", "setorFaceLocalizacoes")
            .leftJoin("setorFaceLocalizacoes.bairro", "setorFaceBairro")
            .leftJoin("setor.montanha", "setorMontanha")
            .leftJoin("setorMontanha.localizacoes", "setorMontanhaLocalizacoes")
            .leftJoin("setorMontanhaLocalizacoes.bairro", "setorMontanhaBairro")
            .leftJoin("via.face", "face")
            .leftJoin("face.localizacoes", "faceLocalizacoes")
            .leftJoin("faceLocalizacoes.bairro", "faceBairro")
            .leftJoin("via.montanha", "montanha")
            .leftJoin("montanha.localizacoes", "montanhaLocalizacoes")
            .leftJoin("montanhaLocalizacoes.bairro", "montanhaBairro")
            .where(
                "(LOWER(setorBairro.nome) = :bairro OR LOWER(setorFaceBairro.nome) = :bairro OR LOWER(setorMontanhaBairro.nome) = :bairro OR LOWER(faceBairro.nome) = :bairro OR LOWER(montanhaBairro.nome) = :bairro)",
                { bairro: bairro.toLowerCase() }
            )
            .getCount();
    }
}
