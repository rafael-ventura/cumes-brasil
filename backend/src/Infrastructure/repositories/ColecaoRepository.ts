import { AppDataSource } from '../config/db';
import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { Via } from '../../Domain/entities/Via';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';

@Service()
export class ColecaoRepository extends BaseRepository<Colecao> implements ISearchRepository<Colecao>, ICrudRepository<Colecao> {
    constructor() {
        super(Colecao);
    }

    async getById(id: number, relations?: string[]): Promise<Colecao | null> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .where('colecao.id = :id', { id })
          .getOne();
    }

    async getAll(): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .getMany();
    }

    async getByUsuarioId(usuario_id: number): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .where('usuario.id = :usuario_id', { usuario_id })
          .getMany();
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
          .where('colecao.usuario.id = :usuarioId', { usuarioId })
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

        // Ajuste das junções
        let qb = this.repository.createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'via')
          .leftJoinAndSelect('via.montanha', 'montanha')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
            .leftJoinAndSelect('colecao.usuario', 'usuario');

        // Filtro default pelo ID do usuário logado
        qb = qb.andWhere('colecao.usuario.id = :usuarioId', { usuarioId });

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
            qb = qb.andWhere('via.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }

        // Filtro por nome da montanha caso você queira buscar coleções que tenham vias em uma determinada montanha)
        if (nomeMontanha) {
            qb = qb.andWhere('montanha.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }

        // Aplicação da ordenação dinâmica
        if (sortField && sortOrder) {
            qb = qb.orderBy(`colecao.${sortField}`, sortOrder.toUpperCase());
        }

        // Contar o total de itens (coleções) correspondentes
        const totalItems = await qb.getCount();

        // Buscar coleções paginadas
        const items = await qb
          .skip((page - 1) * itemsPerPage)
          .take(itemsPerPage)
          .getMany();

        // Calcular total de páginas
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            items: items as Colecao[], // Garantir que o TypeScript entenda o tipo
            totalPages,
            totalItems
        };
    }

}
