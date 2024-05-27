import { AppDataSource } from "../config/db";
import { Colecao } from "../../Domain/entities/Colecao";
import { Via } from "../../Domain/entities/Via";
import { ColecaoVia } from "../../Domain/entities/ColecaoVia";

export class ColecaoRepository {
    private repository = AppDataSource.getRepository(Colecao);
    private viaRepository = AppDataSource.getRepository(Via);
    private colecaoViaRepository = AppDataSource.getRepository(ColecaoVia);

    async getById (id: number): Promise<Colecao | null> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect("colecao.usuario", "usuario")
          .leftJoinAndSelect("colecao.imagem", "imagem")
          .where("colecao.id = :id", { id })
          .getOne();
    }

    async getAll (): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect("colecao.usuario", "usuario")
          .leftJoinAndSelect("colecao.imagem", "imagem")
          .getMany();
    }

    async getByUsuarioId (usuario_id: number): Promise<Colecao[]> {
        return this.repository.find({ where: { id: usuario_id } });
    }

    async create (colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.save(colecaoData);
    }

    async update (id: number, colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.update(id, colecaoData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async addViaToColecao (via_id: number, colecao_id: number): Promise<void> {
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

    async removeViaFromColecao (via_id: number, colecao_id: number): Promise<void> {
        await this.colecaoViaRepository.delete({
            via_id,
            colecao_id
        });

    }
}
