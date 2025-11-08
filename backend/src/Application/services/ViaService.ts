import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { Via } from '../../Domain/entities/Via';
import ViaValidation from '../validations/ViaValidation';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import BaseService from './BaseService';

export class ViaService extends BaseService<Via, ViaRepository> {

  constructor(viaRepo: ViaRepository) {
    super(viaRepo);
  }

  async getViaById(id: number): Promise<Via> {
    const via = await this.repository.getById(id);
    if (!via) throw new NotFoundError("Via não encontrada");
    return via;
  }

  async getVias(page?: number, limit?: number) {
    return page && limit
        ? this.repository.getAllPaginated(page, limit as any)
        : this.repository.getAllWithoutPagination();
  }

  async getRandomVia(): Promise<Via> {
    const via = await this.repository.getRandom();
    if (!via) throw new NotFoundError("Nenhuma via encontrada");
    return via;
  }

  async createVia(viaData: Partial<Via>): Promise<Via> {
    return this.repository.create(viaData);
  }

  async updateVia(id: number, viaData: Partial<Via>): Promise<Via | null> {
    return this.repository.updateVia(id, viaData);
  }

  async deleteVia(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getViasIdByColecaoId(colecaoId: number, page: number, limit: number) {
    return this.repository.getViasByColecaoId(colecaoId, page, limit);
  }

  async getViasNotInColecaoForUser(colecaoId: number, usuarioId: number, page: number, limit: number) {
    if (!colecaoId || !usuarioId) {
      throw new BadRequestError("Parâmetros inválidos: colecaoId ou usuarioId ausentes.");
    }
    return this.repository.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit);
  }

  async countEntities({ key, value }: { key: string; value: string }): Promise<number> {
    const validValue = ViaValidation.validaValores(key, value);

    switch (key) {
      case "grau":
        return this.repository.countByField("via.grau", validValue);
      case "bairro":
        return this.repository.countByField("LOWER(montanha.bairro)", typeof validValue !== "number" ? validValue?.toLowerCase() : validValue);
      case "exposicao":
        return this.repository.countByField("via.exposicao", validValue, "<=");
      case "duracao":
        return this.repository.countByField("via.duracao", validValue, "=");
      default:
        throw new BadRequestError("Filtro inválido. Use grau, bairro, exposicao ou duracao.");
    }
  }
}
