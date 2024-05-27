import { AppDataSource } from "../config/db";
import { Colecao } from "../../Domain/entities/Colecao";
import { Via } from "../../Domain/entities/Via";

export class ColecaoRepository {
    private repository = AppDataSource.getRepository(Colecao);
    private viaRepository = AppDataSource.getRepository(Via);

    async getById (id: number): Promise<Colecao | null> {
        return this.repository.findOne({ where: { id } });
    }

    async getAll (): Promise<Colecao[]> {
        return this.repository.find();
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
        const existingRelation = await this.viaRepository.createQueryBuilder()
          .relation(Via, "colecoes")
          .of(via_id)
          .loadMany();

        if (existingRelation.some(colecao => colecao.id === colecao_id)) {
            return;
        }
        await this.viaRepository.createQueryBuilder()
          .relation(Via, "colecoes")
          .of(via_id)
          .add(colecao_id);
    }

    async removeViaFromColecao (via_id: number, colecao_id: number): Promise<void> {
        await this.viaRepository.createQueryBuilder()
          .relation(Via, "colecoes")
          .of(via_id)
          .remove(colecao_id);
    }
}
