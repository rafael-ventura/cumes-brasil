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

  async getViasNotInColecaoForUser (
    colecaoId: number,
    usuarioId: number,
    page: number,
    limit: number
  ): Promise<{ vias: Via[]; total: number }> {
    if (!colecaoId || !usuarioId) {
      throw new Error('Parâmetros inválidos: colecaoId ou usuarioId ausentes.');
    }

    return this.viaRepo.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit);
  }


  async countEntities({ key, value }: { key: string; value: string }): Promise<number> {
    const validValue = ViaValidation.validaValores(key, value);

    switch (key) {
      case 'grau':
        return await this.viaRepo.countByField('via.grau', validValue);
      case 'bairro':
        return await this.viaRepo.countByField('LOWER(montanha.bairro)', validValue);
      case 'exposicao':
        return await this.viaRepo.countByField('via.exposicao', validValue, '<=');
      case 'duracao':
        return await this.viaRepo.countByField('via.duracao', validValue, '=');
      default:
        throw new Error('Filtro inválido. Use grau, bairro, exposicao ou duracao.');
    }
  }
}
