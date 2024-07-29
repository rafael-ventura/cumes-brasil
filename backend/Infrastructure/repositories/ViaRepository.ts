//src/Infrastructure/repositories/ViaRepository.ts
import { Via } from "../../Domain/entities/Via";
import { AppDataSource } from "../config/db";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";

export class ViaRepository implements ISearchRepository<Via>{

  private repository = AppDataSource.getRepository(Via);
  async getById (id: number): Promise<Via | null> {
    return this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("via.id = :id", { id })
      .getOne();
  }

  async getAll (): Promise<Via[]> {
    return await this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .getMany();
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
    return await this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.viasColecoes", "viasColecoes")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("viasColecoes.colecao_id = :colecaoId", { colecaoId })
      .getMany();
  }


  async search(query: any): Promise<Via[]> {
    console.log("Query received:", query); // Adicione esta linha para depuração

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

    // Para garantir que a consulta está correta
    console.log("Generated SQL Query: ", qb.getSql());

    return await qb.getMany();
  }

  async count(filters: any): Promise<number> {
    console.log("Counting entities with filters: ", filters); // Adicione esta linha para depuração

    let qb = this.repository.createQueryBuilder('via');

    if (filters.searchQuery) {
      qb = qb.andWhere('via.nome LIKE :searchQuery', { searchQuery: `%${filters.searchQuery}%` });
    }

    if (filters.selectedMountain) {
      qb = qb.andWhere('via.montanha_id = :selectedMountain', { selectedMountain: filters.selectedMountain });
    }

    if (filters.selectedDifficulty) {
      qb = qb.andWhere('via.grau = :selectedDifficulty', { selectedDifficulty: filters.selectedDifficulty });
    }

    if (filters.selectedExposure) {
      qb = qb.andWhere('via.exposicao = :selectedExposure', { selectedExposure: filters.selectedExposure });
    }

    return await qb.getCount();
  }

}
