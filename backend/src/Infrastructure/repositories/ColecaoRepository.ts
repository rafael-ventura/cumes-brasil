import { AppDataSource } from '../config/db';
import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from "../../Domain/interfaces/repositories/ISearchRepository";
import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";

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
        const offset = (page - 1) * limit;
        const [colecoes, total] = await this.repository.createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.viasColecoes', 'viasColecoes')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .where('viasColecoes.via_id IS NULL OR viasColecoes.via_id != :viaId', { viaId })
          .andWhere((qb) => {
              const subQuery = qb.subQuery()
                .select('colecao.id')
                .from('colecao', 'colecao')
                .leftJoin('colecao.viasColecoes', 'viasColecoes')
                .where('viasColecoes.via_id = :viaId')
                .getQuery();
              return 'colecao.id NOT IN ' + subQuery;
          })
          .skip(offset)
          .take(limit)
          .getManyAndCount();

        return {
            colecoes,
            total
        };
    };

    async search(query: any): Promise<ISearchResult<Colecao>> {
        const { nomeColecao, nomeVia, nomeMontanha } = query;

        let qb = this.repository.createQueryBuilder('colecao')
            .leftJoinAndSelect('colecao.vias', 'via')
            .leftJoinAndSelect('via.montanha', 'montanha');

        if (nomeColecao) {
            qb = qb.andWhere('colecao.nome LIKE :nomeColecao', { nomeColecao: `%${nomeColecao}%` });
        }

        if (nomeVia) {
            qb = qb.andWhere('via.nome LIKE :nomeVia', { nomeVia: `%${nomeVia}%` });
        }

        if (nomeMontanha) {
            qb = qb.andWhere('montanha.nome LIKE :nomeMontanha', { nomeMontanha: `%${nomeMontanha}%` });
        }

        return {
            items: await qb.getMany(),
            totalItems: await qb.getCount(),
            totalPages: 1
        }
    }
}
