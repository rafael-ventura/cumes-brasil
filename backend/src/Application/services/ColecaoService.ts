import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Colecao } from '../../Domain/entities/Colecao';

export class ColecaoService {
  constructor(
    private colecaoRepo: ColecaoRepository
  ) {}

  async getColecaoById(id: number): Promise<Colecao | null> {
    return this.colecaoRepo.getById(id);
  }

  async getAllColecoes(): Promise<Colecao[]> {
    return this.colecaoRepo.getAll();
  }

  async getColecoesByUsuarioId(usuarioId: number): Promise<Colecao[]> {
    return this.colecaoRepo.getByUsuarioId(usuarioId);
  }

  async createColecao(colecaoData: Partial<Colecao>): Promise<void> {
    await this.colecaoRepo.create(colecaoData);
  }

  async updateColecao(id: number, colecaoData: Partial<Colecao>): Promise<void> {
    const colecao = await this.colecaoRepo.getById(id);
    if (!colecao) {
      throw new Error('Coleção não encontrada');
    }
    await this.colecaoRepo.update(id, colecaoData);
  }

  async deleteColecao(id: number): Promise<void> {
    const colecao = await this.colecaoRepo.getById(id);
    if (!colecao) {
      throw new Error('Coleção não encontrada');
    }
    await this.colecaoRepo.delete(id);
  }

  async addViaToColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.colecaoRepo.addViaToColecao(viaId, colecaoId);
  }

  async removeViaFromColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.colecaoRepo.removeViaFromColecao(viaId, colecaoId);
  }

  async getColecoesNotContainingVia (viaId: number, page: number, limit: number): Promise<{
    colecoes: Colecao[],
    total: number
  }> {
    return this.colecaoRepo.getColecoesNotContainingVia(viaId, page, limit);
  }
}
