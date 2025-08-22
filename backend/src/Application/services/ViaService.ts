import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { Via } from '../../Domain/entities/Via';
import ViaValidation from '../validations/ViaValidation';

export class ViaService {
  private viaRepo: ViaRepository;

  constructor(viaRepo: ViaRepository) {
    this.viaRepo = viaRepo;
  }

  async getViaById(id: number): Promise<Via> {
    const via = await this.viaRepo.getById(id);
    if (!via) throw new Error("Via não encontrada");
    return via;
  }

  async getVias(page?: number, limit?: number) {
    return page && limit
        ? this.viaRepo.getAll(page, limit)
        : this.viaRepo.getAllWithoutPagination();
  }

  async getRandomVia(): Promise<Via> {
    const via = await this.viaRepo.getRandom();
    if (!via) throw new Error("Nenhuma via encontrada");
    return via;
  }

  async createVia(viaData: Partial<Via>): Promise<Via> {
    return this.viaRepo.create(viaData);
  }

  async updateVia(id: number, viaData: Partial<Via>): Promise<Via | null> {
    return this.viaRepo.update(id, viaData);
  }

  async deleteVia(id: number): Promise<void> {
    await this.viaRepo.delete(id);
  }

  async getViasIdByColecaoId(colecaoId: number, page: number, limit: number) {
    return this.viaRepo.getViasByColecaoId(colecaoId, page, limit);
  }

  async getViasNotInColecaoForUser(colecaoId: number, usuarioId: number, page: number, limit: number) {
    if (!colecaoId || !usuarioId) {
      throw new Error("Parâmetros inválidos: colecaoId ou usuarioId ausentes.");
    }
    return this.viaRepo.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit);
  }

  async countEntities({ key, value }: { key: string; value: string }): Promise<number> {
    const validValue = ViaValidation.validaValores(key, value);

    switch (key) {
      case "grau":
        return this.viaRepo.countByField("via.grau", validValue);
      case "bairro":
        return this.viaRepo.countByField("LOWER(montanha.bairro)", typeof validValue !== "number" ? validValue?.toLowerCase() : validValue);
      case "exposicao":
        return this.viaRepo.countByField("via.exposicao", validValue, "<=");
      case "duracao":
        return this.viaRepo.countByField("via.duracao", validValue, "=");
      default:
        throw new Error("Filtro inválido. Use grau, bairro, exposicao ou duracao.");
    }
  }
}
