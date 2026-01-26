import { AppDataSource } from '../config/db';
import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { Via } from '../../Domain/entities/Via';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';
import { withColecaoRelations } from '../helpers/QueryRelations';

@Service()
export class ColecaoRepository extends BaseRepository<Colecao> implements ISearchRepository<Colecao>, ICrudRepository<Colecao> {
    constructor() {
        super(Colecao);
    }

    async getById(id: number, relations?: string[]): Promise<Colecao | null> {
        const qb = this.repository.createQueryBuilder('colecao')
            .where('colecao.id = :id', { id });
        
        return withColecaoRelations(qb, 'full').getOne();
    }

    async getAll(): Promise<Colecao[]> {
        const qb = this.repository.createQueryBuilder('colecao');
        return withColecaoRelations(qb, 'light').getMany();
    }

    async getByUsuarioId(usuario_id: number): Promise<Colecao[]> {
        const qb = this.repository.createQueryBuilder('colecao')
            .where('colecao.usuarioId = :usuario_id', { usuario_id });
        
        return withColecaoRelations(qb, 'light').getMany();
    }

    async create(colecaoData: Partial<Colecao>): Promise<Colecao> {
        return await this.repository.save(colecaoData);
    }

    async update(id: number, colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.update(id, colecaoData);
    }

    async addViaToColecao(via_id: number, colecao_id: number): Promise<void> {
        // Verificar se a coleção existe
        const colecao = await this.repository.findOne({ where: { id: colecao_id } });
        if (!colecao) {
            throw new Error('Coleção não encontrada');
        }

        // Verificar se a via existe
        const via = await AppDataSource.getRepository(Via).findOne({ where: { id: via_id } });
        if (!via) {
            throw new Error('Via não encontrada');
        }

        // Criar uma nova instância de ViaColecao
        const viaColecao = new ViaColecao();
        viaColecao.colecao = colecao;
        viaColecao.via = via;

        // Salvar a relação usando o repositório de ViaColecao
        const viaColecaoRepository = AppDataSource.getRepository(ViaColecao);
        await viaColecaoRepository.save(viaColecao);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async removeViaFromColecao(via_id: number, colecao_id: number): Promise<void> {
        const viaColecaoRepository = AppDataSource.getRepository(ViaColecao);
        await viaColecaoRepository.delete({
            via: { id: via_id },
            colecao: { id: colecao_id }
        });
    }

    async getColecoesNotContainingViaForUser (
      viaId: number,
      usuarioId: number,
      page: number,
      limit: number
    ): Promise<{ colecoes: Colecao[]; total: number }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
          .createQueryBuilder('via_colecao')
          .select('via_colecao.colecaoId')
          .where('via_colecao.viaId = :viaId', { viaId });

        const [colecoes, total] = await this.repository
          .createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecoes')
          .where('colecao.usuarioId = :usuarioId', { usuarioId })
          .andWhere(`colecao.id NOT IN (${subQuery.getQuery()})`)
          .setParameters(subQuery.getParameters())
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

        // Usar helper para relations com nível light (listagem)
        let qb = this.repository.createQueryBuilder('colecao');
        qb = withColecaoRelations(qb, 'light');

        // Filtro default pelo ID do usuário logado
        qb = qb.andWhere('colecao.usuarioId = :usuarioId', { usuarioId });

        // Filtro por ID da coleção
        if (colecaoId) {
            qb = qb.andWhere('colecao.id = :colecaoId', { colecaoId });
        }

        // Filtro por nome da coleção
        if (searchQuery) {
            qb = qb.andWhere('colecao.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
        }

        // Filtro por nome da via (caso queira buscar por vias dentro da coleção)
        if (nomeVia) {
            qb = qb.andWhere('vias.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }

        // Filtro por nome da montanha
        if (nomeMontanha) {
            qb = qb.andWhere('montanha.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }

        // Aplicação da ordenação
        const isUpdatedAtSort = sortField === 'updated_at';
        
        if (isUpdatedAtSort && sortOrder) {
            // Ordenação por última via adicionada usando subquery no banco
            // Isso evita carregar todos os dados em memória para ordenar
            qb = qb
                .addSelect(subQuery => {
                    return subQuery
                        .select('MAX(vc.created_at)')
                        .from('via_colecao', 'vc')
                        .where('vc.colecaoId = colecao.id');
                }, 'ultima_via_adicionada')
                .orderBy(
                    'ultima_via_adicionada', 
                    sortOrder.toUpperCase() as 'ASC' | 'DESC', 
                    'NULLS LAST'
                );
        } else if (sortField && sortOrder) {
            qb = qb.orderBy(`colecao.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
        }

        // Contar o total de itens (coleções) correspondentes
        // Clone o queryBuilder para contagem sem a ordenação por subquery
        const countQb = this.repository.createQueryBuilder('colecao')
            .leftJoin('colecao.viaColecoes', 'viaColecaoCount')
            .leftJoin('viaColecaoCount.via', 'viasCount')
            .leftJoin('viasCount.montanha', 'montanhaCount')
            .where('colecao.usuarioId = :usuarioId', { usuarioId });

        if (colecaoId) {
            countQb.andWhere('colecao.id = :colecaoId', { colecaoId });
        }
        if (searchQuery) {
            countQb.andWhere('colecao.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
        }
        if (nomeVia) {
            countQb.andWhere('viasCount.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }
        if (nomeMontanha) {
            countQb.andWhere('montanhaCount.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }

        const totalItems = await countQb.getCount();

        // Paginação no banco
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
