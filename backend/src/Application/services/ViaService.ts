import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { Via } from "../../Domain/entities/Via";

export class ViaService {
  private viaRepo: ViaRepository;

  constructor(viaRepo: ViaRepository) {
    this.viaRepo = viaRepo;
  }

  async getViaById(id: number): Promise<Via> {
    const via = await this.viaRepo.getById(id);
    if (!via) {
      throw new Error("Via não encontrada");
    }
    return via;
  }

  async getVias(page?: number, limit?: number): Promise<{ vias: Via[], total: number }> {
    if (page !== undefined && limit !== undefined) {
      return this.viaRepo.getAll(page, limit);
    } else {
      return this.viaRepo.getAllWithoutPagination();
    }
  }

  async createVia(viaData: Partial<Via>): Promise<void> {
    return this.viaRepo.create(viaData);
  }

  async updateVia(id: number, viaData: Partial<Via>): Promise<void> {
    await this.viaRepo.update(id, viaData);
  }

  async deleteVia(id: number): Promise<void> {
    await this.viaRepo.delete(id);
  }

  async getViasIdByColecaoId(colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    return this.viaRepo.getViasByColecaoId(colecaoId, page, limit);
  }

  async getViasNotInColecaoId(colecaoId: number, page: number, limit: number): Promise<{ vias: Via[], total: number }> {
    return this.viaRepo.getViasNotInColecaoId(colecaoId, page, limit);
  }
}
