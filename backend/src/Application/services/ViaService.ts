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
    // Validar estrutura física antes de criar
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.create(viaData);
  }

  async updateVia(id: number, viaData: Partial<Via>): Promise<Via | null> {
    // Validar estrutura física antes de atualizar
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.updateVia(id, viaData);
  }

  /**
   * Obtém a estrutura física completa da via (setor, face, montanha)
   * Retorna a hierarquia completa baseada na prioridade: setor > face > montanha
   */
  getEstruturaFisica(via: Via): {
    setor?: any;
    face?: any;
    montanha?: any;
  } | null {
    if (!via) return null;

    // Prioridade: setor > face > montanha
    if (via.setor) {
      const setor = via.setor as any;
      return {
        setor: {
          id: setor.id,
          nome: setor.nome,
          latitude: setor.latitude,
          longitude: setor.longitude
        },
        face: setor.face ? {
          id: setor.face.id,
          nome: setor.face.nome,
          fantasia: setor.face.fantasia,
          latitude: setor.face.latitude,
          longitude: setor.face.longitude,
          montanha: setor.face.montanha ? {
            id: setor.face.montanha.id,
            nome: setor.face.montanha.nome,
            altura: setor.face.montanha.altura,
            latitude: setor.face.montanha.latitude,
            longitude: setor.face.montanha.longitude
          } : undefined
        } : undefined,
        montanha: setor.montanha && !setor.face ? {
          id: setor.montanha.id,
          nome: setor.montanha.nome,
          altura: setor.montanha.altura,
          latitude: setor.montanha.latitude,
          longitude: setor.montanha.longitude
        } : undefined
      };
    }

    if (via.face) {
      const face = via.face as any;
      return {
        face: {
          id: face.id,
          nome: face.nome,
          fantasia: face.fantasia,
          latitude: face.latitude,
          longitude: face.longitude,
          montanha: face.montanha ? {
            id: face.montanha.id,
            nome: face.montanha.nome,
            altura: face.montanha.altura,
            latitude: face.montanha.latitude,
            longitude: face.montanha.longitude
          } : undefined
        }
      };
    }

    if (via.montanha) {
      const montanha = via.montanha as any;
      return {
        montanha: {
          id: montanha.id,
          nome: montanha.nome,
          altura: montanha.altura,
          latitude: montanha.latitude,
          longitude: montanha.longitude
        }
      };
    }

    return null;
  }

  /**
   * Obtém a montanha associada à via (direta ou através de face/setor)
   */
  getMontanha(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor?.face?.montanha || 
           estrutura.setor?.montanha || 
           estrutura.face?.montanha || 
           estrutura.montanha || 
           null;
  }

  /**
   * Obtém a face associada à via (direta ou através de setor)
   */
  getFace(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor?.face || estrutura.face || null;
  }

  /**
   * Obtém o setor associado à via
   */
  getSetor(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor || null;
  }

  /**
   * Verifica se a via está em um setor
   */
  estaEmSetor(via: Via): boolean {
    return !!this.getSetor(via);
  }

  /**
   * Verifica se a via está em uma face (diretamente ou através de setor)
   */
  estaEmFace(via: Via): boolean {
    return !!this.getFace(via);
  }

  /**
   * Verifica se a via está em uma montanha (diretamente, através de face ou setor)
   */
  estaEmMontanha(via: Via): boolean {
    return !!this.getMontanha(via);
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
        return this.repository.countByBairro(typeof validValue !== "number" ? validValue : String(validValue));
      case "exposicao":
        return this.repository.countByField("via.exposicao", validValue, "<=");
      case "duracao":
        return this.repository.countByField("via.duracao", validValue, "=");
      default:
        throw new BadRequestError("Filtro inválido. Use grau, bairro, exposicao ou duracao.");
    }
  }
}
