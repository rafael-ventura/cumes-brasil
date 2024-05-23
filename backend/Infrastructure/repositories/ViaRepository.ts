import { Via } from "../../Domain/entities/Via";
import { AppDataSource } from "../config/db";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";

export class ViaRepository implements ISearchRepository<Via>{

  private repository = AppDataSource.getRepository(Via);

  async getById (id: number): Promise<Via | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["montanha", "face", "fonte", "croquis"],
    });
  }

  async getAll (): Promise<Via[]> {
    return this.repository.find({ relations: ["montanha", "face", "fonte", "croquis"] });
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

  async addCroqui (viaId: number, croquiId: number): Promise<void> {
    await this.repository.createQueryBuilder()
      .relation(Via, "croquis")
      .of(viaId)
      .add(croquiId);
  }

  async removeCroqui (viaId: number, croquiId: number): Promise<void> {
    await this.repository.createQueryBuilder()
      .relation(Via, "croquis")
      .of(viaId)
      .remove(croquiId);
  }

  async getViasIdByColecaoId (colecaoId: number): Promise<number[]> {
    const vias = await this.repository.createQueryBuilder("via")
      .leftJoin("via.colecoes", "colecao")
      .where("colecao.id = :colecaoId", { colecaoId })
      .getMany();
    return vias.map(via => via.id);
  }

  async search(query: any): Promise<Via[]> {
    const { searchQuery, selectedMountain, selectedDifficulty, selectedExposure } = query;

    let qb = this.repository.createQueryBuilder('via');

    if (searchQuery) {
      qb = qb.andWhere('via.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
    }

    if (selectedMountain) {
      qb = qb.andWhere('via.montanha_id = :selectedMountain', { selectedMountain });
    }

    if (selectedDifficulty) {
      qb = qb.andWhere('via.grau = :selectedDifficulty', { selectedDifficulty });
    }

    if (selectedExposure) {
      qb = qb.andWhere('via.exposicao = :selectedExposure', { selectedExposure });
    }

    return await qb.getMany();
  }
}
