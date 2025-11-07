import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Colecao } from '../../Domain/entities/Colecao';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import BaseService from './BaseService';

export class ColecaoService extends BaseService<Colecao, ColecaoRepository> {
  constructor(
    colecaoRepo: ColecaoRepository
  ) {
    super(colecaoRepo);
  }

  async getColecaoById(id: number): Promise<Colecao | null> {
    return this.repository.getById(id);
  }

  async getAllColecoes(): Promise<Colecao[]> {
    return this.repository.getAll();
  }

  async getColecoesByUsuarioId(usuarioId: number): Promise<Colecao[]> {
    return this.repository.getByUsuarioId(usuarioId);
  }

  async createColecao(colecaoData: Partial<Colecao>): Promise<void> {
    await this.repository.create(colecaoData);
  }

  async updateColecao(id: number, colecaoData: Partial<Colecao>): Promise<void> {
    const colecao = await this.repository.getById(id);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    await this.repository.update(id, colecaoData);
  }

  async deleteColecao(id: number): Promise<void> {
    const colecao = await this.repository.getById(id);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    await this.repository.delete(id);
  }

  async addViaToColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.colecaoRepo.addViaToColecao(viaId, colecaoId);
  }

  async removeViaFromColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.colecaoRepo.removeViaFromColecao(viaId, colecaoId);
  }

  async getColecoesNotContainingViaForUser (
    viaId: number,
    usuarioId: number,
    page: number,
    limit: number
  ): Promise<{ colecoes: Colecao[]; total: number }> {
    if (!usuarioId || !viaId) {
      throw new BadRequestError('Parâmetros inválidos: usuário ou via ausente.');
    }

    return await this.repository.getColecoesNotContainingViaForUser(
      viaId,
      usuarioId,
      page,
      limit
    );
  }

}
