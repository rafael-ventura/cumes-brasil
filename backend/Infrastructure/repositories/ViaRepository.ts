import { Via } from "../../Domain/entities/Via";
import { AppDataSource } from "../config/db";
import { Colecao } from "../../Domain/entities/Colecao";

export class ViaRepository {

  private repository = AppDataSource.getRepository(Via);

  async getById (id: number): Promise<Via | null> {
    return this.repository.findOne({ where: { id } });
  }

  async getAll (): Promise<Via[]> {
    return this.repository.find();
  }

  async create (via: Partial<Via>): Promise<void> {
    await this.repository.insert(via);
  }

  async update (id: number, viaData: Partial<Via>): Promise<void> {
    await this.repository.update(id as any, viaData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id as any);
  }

  async getViasByColecaoId (colecaoId: number): Promise<Via[]> {
    const colecaoRepository = AppDataSource.getRepository(Colecao);
    const colecao = await colecaoRepository.findOne({ where: { id: colecaoId } });

    return colecao ? colecao.vias : [];
  }
}
