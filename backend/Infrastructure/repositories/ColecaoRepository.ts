import { AppDataSource } from "../config/db";
import { Colecao } from "../../Domain/entities/Colecao";
import { Via } from "../../Domain/entities/Via";

export class ColecaoRepository {
    private repository = AppDataSource.getRepository(Colecao);
    private viaRepository = AppDataSource.getRepository(Via);

    async getById (id: number): Promise<Colecao | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["vias", "usuario"]
        });
    }

    async getAll (): Promise<Colecao[]> {
        return this.repository.find({
            relations: ["vias", "usuario"]
        });
    }

    async getByUsuarioId (usuarioId: number): Promise<Colecao[]> {
        return this.repository.find({
            where: { usuario: usuarioId as any },
            relations: ["vias", "usuario"]
        });
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

    async addViaToColecao (viaId: number, colecaoId: number): Promise<void> {
        await this.viaRepository.createQueryBuilder()
          .relation(Via, "colecoes")
          .of(viaId)
          .add(colecaoId);
    }

    async removeViaFromColecao (viaId: number, colecaoId: number): Promise<void> {
        await this.viaRepository.createQueryBuilder()
          .relation(Via, "colecoes")
          .of(viaId)
          .remove(colecaoId);
    }
}
