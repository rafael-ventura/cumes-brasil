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

  async buscarPorId(id: number): Promise<Via> {
    const via = await this.repository.getById(id);
    if (!via) throw new NotFoundError("Via não encontrada");
    return via;
  }

  async listar(page: number = 1, limit: number = 50) {
    return this.repository.getAllPaginated(page, limit);
  }

  async aleatoria(): Promise<Via> {
    const via = await this.repository.aleatoria();
    if (!via) throw new NotFoundError("Nenhuma via encontrada");
    return via;
  }

  async criar(viaData: Partial<Via>): Promise<Via> {
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.create(viaData);
  }

  async atualizar(id: number, viaData: Partial<Via>): Promise<Via | null> {
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.atualizar(id, viaData);
  }

  async deletar(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async listarPorColecao(colecaoId: number, page: number, limit: number) {
    return this.repository.listarPorColecao(colecaoId, page, limit);
  }

  async listarForaDeColecao(colecaoId: number, usuarioId: number, page: number, limit: number) {
    if (!colecaoId || !usuarioId) {
      throw new BadRequestError("Parâmetros inválidos: colecaoId ou usuarioId ausentes.");
    }
    return this.repository.listarForaDeColecao(colecaoId, usuarioId, page, limit);
  }

  async contarPorFiltro({ key, value }: { key: string; value: string }): Promise<number> {
    switch (key) {
      case "grau":
        return this.repository.contarPorCampo("via.grau", ViaValidation.validaValores(key, value));
      case "bairro":
        return this.repository.contarPorBairro(String(ViaValidation.validaValores(key, value)));
      case "exposicao":
        return this.repository.contarPorCampo("via.exposicao", ViaValidation.validaValores(key, value), "<=");
      case "duracao":
        return this.repository.contarPorCampo("via.duracao", ViaValidation.validaValores(key, value), "=");
      case "via_cerj":
        return this.repository.contarPorCampo("via.via_cerj", true);
      case "com_croqui":
        return this.repository.contarComCroqui();
      case "modalidade":
        return this.repository.contarPorCampo("via.modalidade", ViaValidation.validaValores(key, value));
      case "sem_grau":
        return this.repository.contarPorCampo("via.grau", null, "IS NULL");
      case "sem_localizacao":
        return this.repository.contarSemLocalizacao();
      default:
        throw new BadRequestError("Filtro inválido.");
    }
  }
}
