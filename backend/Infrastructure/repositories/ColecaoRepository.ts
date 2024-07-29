import {AppDataSource} from "../config/db";
import {Colecao} from "../../Domain/entities/Colecao";
import {ColecaoVia} from "../../Domain/entities/ColecaoVia";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";

export class ColecaoRepository implements ISearchRepository<Colecao> {
    private repository = AppDataSource.getRepository(Colecao);
    private colecaoViaRepository = AppDataSource.getRepository(ColecaoVia);

    async getById(id: number): Promise<Colecao | null> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .where("colecao.id = :id", {id})
            .getOne();
    }

    async getAll(): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
            .getMany();
    }

    async getByUsuarioId(usuario_id: number): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
            .leftJoin("colecao.usuario", "usuario")
            .addSelect("usuario.id", "usuario_id")
            .leftJoinAndSelect("colecao.imagem", "imagem")
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

    async addViaToColecao(via_id: number, colecao_id: number): Promise<void> {
        const existingEntry = await this.colecaoViaRepository.findOne({
            where: {
                via_id,
                colecao_id
            }
        });

        if (existingEntry) {
            throw new Error("A via já está presente nesta coleção.");
        }
        const colecaoVia = this.colecaoViaRepository.create({
            via_id,
            colecao_id
        });
        await this.colecaoViaRepository.save(colecaoVia);
    }

    async removeViaFromColecao(via_id: number, colecao_id: number): Promise<void> {
        await this.colecaoViaRepository.delete({
            via_id,
            colecao_id
        });

    }

    async search(query: any): Promise<Colecao[]> {
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

        return await qb.getMany();
    }

    async count(query: any): Promise<number> {
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

        return await qb.getCount();
    }
}
