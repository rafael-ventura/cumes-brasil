import { AppDataSource } from '../config/db';
import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';

@Service()
export class ColecaoRepository implements ISearchRepository<Colecao> {
    private repository = AppDataSource.getRepository(Colecao);

    async getById(id: number): Promise<Colecao | null> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .where("colecao.id = :id", {id})
            .getOne();
    }

    async getAll(): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .getMany();
    }

    async getByUsuarioId(usuario_id: number): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .leftJoinAndSelect("colecao.vias", "vias")
            .where("usuario.id = :usuario_id", {usuario_id})
            .getMany();
    }

    async create(colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.save(colecaoData);
    }

    async update(id: number, colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.update(id, colecaoData);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async addViaToColecao (via_id: number, colecao_id: number): Promise<void> {
        return this.repository.createQueryBuilder()
            .relation(Colecao, 'vias')
            .of(colecao_id)
            .add(via_id);
    }

    async removeViaFromColecao(via_id: number, colecao_id: number): Promise<void> {
        return this.repository.createQueryBuilder()
            .relation(Colecao, 'vias')
            .of(colecao_id)
            .remove(via_id);
    }

    async getColecoesNotContainingVia (viaId: number, page: number, limit: number): Promise<{
        colecoes: Colecao[],
        total: number
    }> {
        const [colecoes, total] = await this.repository.createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.vias', 'vias')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .where(qb => {
              const subQuery = qb.subQuery()
                .select('via_colecao.colecao_id')
                .from('via_colecao', 'via_colecao')
                .where('via_colecao.via_id = :viaId')
                .getQuery();
              return `colecao.id NOT IN ${subQuery}`;
          })
          .setParameter('viaId', viaId)
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();

        return {
            colecoes,
            total
        };
    }

    async search(query: any): Promise<ISearchResult<Colecao>> {
        const { searchQuery, colecaoId, nomeVia, nomeMontanha, page = 1, itemsPerPage = 10 } = query;

        // Criar a query builder da coleção, incluindo as vias e montanhas associadas
        let qb = this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.vias', 'via') // Associa as vias à coleção
            .leftJoinAndSelect('via.montanha', 'montanha'); // Associa a montanha à via

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
            items,
            totalPages,
            totalItems
        };
    }
}
