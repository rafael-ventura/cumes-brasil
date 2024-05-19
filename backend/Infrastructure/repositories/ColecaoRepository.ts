import { AppDataSource } from "../config/db";
import { Colecao } from "../../Domain/entities/Colecao";
import { Via } from "../../Domain/entities/Via";

export class ColecaoRepository {
    private repository = AppDataSource.getRepository(Colecao);
    private viaRepository = AppDataSource.getRepository(Via);

    async getById (id: number): Promise<Colecao | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["vias"]
        });
    }

    async getAll (): Promise<Colecao[]> {
        return this.repository.find({
            relations: ["vias"]
        });
    }

    async getByUsuarioId (usuarioId: number): Promise<Colecao[]> {
        return this.repository.find({
            where: { usuario_id: usuarioId as any },
            relations: ["vias"]
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

    async addViaToColecao (via_id: number, colecao_id: number): Promise<void> {
        // verificação para evitar duplicatas. Não encontrei um jeito melhor para não usar a verificacao
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
