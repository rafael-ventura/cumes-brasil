import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { ColecaoRelationConfig } from './config/ColecaoRelationConfig';
import { QueryRunner, SelectQueryBuilder } from 'typeorm';
import { QueryBuilderHelper } from '../helpers/QueryBuilderHelper';
import { RepositoryOptions } from './config/RepositoryOptions';
import { ViaColecaoRepository } from './ViaColecaoRepository';

/**
 * Repository para entidade Colecao.
 */
@Service()
export class ColecaoRepository extends BaseRepository<Colecao> implements ISearchRepository<Colecao>, ICrudRepository<Colecao> {
    protected entityTarget = Colecao;
    
    /**
     * Constructor com Dependency Injection.
     * 
     * @param viaColecaoRepository - Repository injetado para gerenciar associações via-coleção
     */
    constructor(
        private viaColecaoRepository: ViaColecaoRepository
    ) {
        super(Colecao);
    }

    private applyRelationsFromOptions(
        queryBuilder: SelectQueryBuilder<Colecao>,
        options?: RepositoryOptions<Colecao>
    ): SelectQueryBuilder<Colecao> {
        if (options?.relations && options.relations.length > 0) {
            options.relations.forEach(relation => {
                queryBuilder.leftJoinAndSelect(`colecao.${relation}`, relation);
            });
            return queryBuilder;
        }

        const strategy = options?.strategy ?? LoadStrategy.DETAIL;
        return QueryBuilderHelper.applyRelations(queryBuilder, 'colecao', strategy, ColecaoRelationConfig);
    }

    async getById(id: number, options?: RepositoryOptions<Colecao>): Promise<Colecao | null> {
        const queryBuilder = this.repository.createQueryBuilder("colecao")
            .where('colecao.id = :id', { id });
        return this.applyRelationsFromOptions(queryBuilder, options).getOne();
    }

    async getAll(options?: RepositoryOptions<Colecao>): Promise<Colecao[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.DETAIL };
        const queryBuilder = this.repository.createQueryBuilder("colecao");
        return this.applyRelationsFromOptions(queryBuilder, effectiveOptions).getMany();
    }

    async getByUsuarioId(usuario_id: number, options?: RepositoryOptions<Colecao>): Promise<Colecao[]> {
        const effectiveOptions = options || { strategy: LoadStrategy.DETAIL };
        const queryBuilder = this.repository.createQueryBuilder("colecao")
            .where('colecao.usuario.id = :usuario_id', { usuario_id });
        return this.applyRelationsFromOptions(queryBuilder, effectiveOptions).getMany();
    }

    async update(id: number, colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.update(id, colecaoData);
    }

    /**
     * Adiciona via à coleção.
     * 
     * @param via_id - ID da via
     * @param colecao_id - ID da coleção
     */
    async addViaToColecao(via_id: number, colecao_id: number): Promise<void> {
        await this.viaColecaoRepository.associar(via_id, colecao_id);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Remove via da coleção. 
     * @param via_id - ID da via
     * @param colecao_id - ID da coleção
     */
    async removeViaFromColecao(via_id: number, colecao_id: number): Promise<void> {
        await this.viaColecaoRepository.desassociar(via_id, colecao_id);
    }

    /**
     * Busca coleções do usuário que NÃO contêm a via especificada.
     * Performance: Mais eficiente que subquery aninhada.
     * 
     * @param viaId - ID da via
     * @param usuarioId - ID do usuário
     * @param page - Número da página
     * @param limit - Itens por página
     * @returns Objeto com array de coleções e total
     */
    async getColecoesNotContainingViaForUser (
      viaId: number,
      usuarioId: number,
      page: number,
      limit: number
    ): Promise<{ colecoes: Colecao[]; total: number }> {
        // Busca IDs de coleções que JÁ contêm a via
        const colecaoIdsComVia = await this.viaColecaoRepository.getColecaoIdsByViaId(viaId);

        const queryBuilder = this.repository
          .createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecoes')
          .where('colecao.usuario.id = :usuarioId', { usuarioId });

        if (colecaoIdsComVia.length > 0) {
            queryBuilder.andWhere('colecao.id NOT IN (:...colecaoIds)', { 
                colecaoIds: colecaoIdsComVia 
            });
        }

        const [colecoes, total] = await queryBuilder
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();

        return {
            colecoes,
            total
        };
    }

    async search(query: any): Promise<ISearchResult<Colecao>> {
        const {
            searchQuery,
            colecaoId,
            usuarioId,
            nomeVia,
            nomeMontanha,
            sortField,
            sortOrder,
            page = 1,
            itemsPerPage = 10
        } = query;

        // ✅ OTIMIZADO: Apenas 8 joins essenciais (vs 32 anteriores)
        // Removidos todos os joins de localização (setor/face/montanha.localizacoes)
        // que causavam N+1 massivo. Frontend pode buscar localizações separadamente se necessário.
        let qb = this.repository.createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'via')
          .leftJoinAndSelect('via.montanha', 'montanha')
          .leftJoinAndSelect('via.face', 'face')
          .leftJoinAndSelect('via.setor', 'setor')
          .leftJoinAndSelect('via.imagem', 'viaImagem');

        qb = qb.andWhere('colecao.usuario.id = :usuarioId', { usuarioId });

        if (colecaoId) {
            qb = qb.andWhere('colecao.id = :colecaoId', { colecaoId });
        }

        if (searchQuery) {
            qb = qb.andWhere('colecao.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
        }

        if (nomeVia) {
            qb = qb.andWhere('via.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }

        // Filtro por nome da montanha - removido pois não temos mais relação direta via -> montanha
        // TODO: Implementar busca por montanha através de localização se necessário
        if (nomeMontanha) {
            // Por enquanto, busca desabilitada
        }

        const isUpdatedAtSort = sortField === 'updated_at';
        
        if (sortField && sortOrder && !isUpdatedAtSort) {
            qb = qb.orderBy(`colecao.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
        }

        const totalItems = await qb.getCount();

        let items: Colecao[];
        
        if (isUpdatedAtSort) {
            items = await qb.getMany();
            
            const colecaoIds = items.map(c => c.id);
            
            if (colecaoIds.length > 0) {
                const maxDatesQuery = this.viaColecaoRepository['repository']
                  .createQueryBuilder('vc')
                  .select('vc.colecaoId', 'colecaoId')
                  .addSelect('MAX(vc.created_at)', 'maxCreatedAt')
                  .where('vc.colecaoId IN (:...colecaoIds)', { colecaoIds })
                  .groupBy('vc.colecaoId');
                
                const maxDates = await maxDatesQuery.getRawMany();

                const maxDateMap = new Map<number, Date | null>();
                for (const row of maxDates) {
                    maxDateMap.set(row.colecaoId, row.maxCreatedAt ? new Date(row.maxCreatedAt) : null);
                }

                items.sort((a, b) => {
                    const dateA = maxDateMap.get(a.id);
                    const dateB = maxDateMap.get(b.id);
                    
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return sortOrder.toUpperCase() === 'DESC' ? 1 : -1;
                    if (!dateB) return sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
                    
                    const diff = dateA.getTime() - dateB.getTime();
                    return sortOrder.toUpperCase() === 'DESC' ? -diff : diff;
                });
            }
            
            const startIndex = (page - 1) * itemsPerPage;
            items = items.slice(startIndex, startIndex + itemsPerPage);
        } else {
            items = await qb
              .skip((page - 1) * itemsPerPage)
              .take(itemsPerPage)
              .getMany();
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            items,
            totalPages,
            totalItems
        };
    }

}
