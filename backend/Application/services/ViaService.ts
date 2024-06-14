import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { Via } from "../../Domain/entities/Via";

export class ViaService {
  private viaRepo: ViaRepository;

  constructor (viaRepo: ViaRepository) {
    this.viaRepo = viaRepo;
  }

  async getViaById (id: number): Promise<Via> {
    const via = await this.viaRepo.getById(id);
    if (!via) {
     throw new Error("Via não encontrada");
    }
    return via;
  }

  async getVias (): Promise<Via[]> {
    return this.viaRepo.getAll();
  }

  async createVia (viaData: Partial<Via>): Promise<void> {
    return this.viaRepo.create(viaData);
  }

  async updateVia (id: number, viaData: Partial<Via>): Promise<void> {
    await this.viaRepo.update(id, viaData);
  }

  async deleteVia (id: number): Promise<void> {

    await this.viaRepo.delete(id);
  }

  async getViasIdByColecaoId (colecaoId: number): Promise<Via[]> {
    return this.viaRepo.getViasByColecaoId(colecaoId);
  }

}
