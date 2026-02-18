import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { Via } from '../../Domain/entities/Via';
import ViaValidation from '../validations/ViaValidation';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import BaseService from './BaseService';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { Service } from 'typedi';

@Service()
export class ViaService extends BaseService<Via, ViaRepository> {

  constructor(viaRepo: ViaRepository) {
    super(viaRepo);
  }


  /**
   * Busca via por ID com detalhes completos.
   * 
   * @param id - ID da via
   * @param strategy - Estratégia de carregamento (default: DETAIL)
   */
  async getViaById(id: number, strategy: LoadStrategy = LoadStrategy.DETAIL): Promise<Via> {
    const via = await this.repository.getById(id, { strategy });
    if (!via) throw new NotFoundError("Via não encontrada");
    return via;
  }

  /**
   * Lista vias com paginação.
   * 
   * @param page - Número da página (opcional)
   * @param limit - Itens por página (opcional)
   * @param strategy - Estratégia de carregamento (default: LIST)
   */
  /**
   * Lista vias com paginação.
   * 
   * @param page - Número da página (opcional)
   * @param limit - Itens por página (opcional)
   * @param strategy - Estratégia de carregamento (default: LIST)
   */
  async getVias(page?: number, limit?: number, strategy: LoadStrategy = LoadStrategy.LIST) {
    return page && limit
        ? this.repository.getAllPaginated(page, limit as any, { strategy })
        : this.repository.getAllWithoutPagination({ strategy });
  }

  /**
   * Busca via aleatória para "Inspire-se".
   * 
   * @param strategy - Estratégia de carregamento (default: LIST)
   */
  async getRandomVia(strategy: LoadStrategy = LoadStrategy.LIST): Promise<Via> {
    const via = await this.repository.getRandom({ strategy });
    if (!via) throw new NotFoundError("Nenhuma via encontrada");
    return via;
  }

  /**
   * Cria nova via.
   * @param viaData - Dados da via
   * @param reloadStrategy - Estratégia de recarregamento após criação (default: DETAIL)
   */
  async createVia(viaData: Partial<Via>, reloadStrategy: LoadStrategy = LoadStrategy.DETAIL): Promise<Via> {
    // Validar estrutura física antes de criar
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.create(viaData, undefined, { strategy: reloadStrategy });
  }

  /**
   * Atualiza via existente.
   * @param id - ID da via
   * @param viaData - Dados para atualizar
   * @param reloadStrategy - Estratégia de recarregamento após atualização (default: DETAIL)
   */
  async updateVia(id: number, viaData: Partial<Via>, reloadStrategy: LoadStrategy = LoadStrategy.DETAIL): Promise<Via | null> {
    // Validar estrutura física antes de atualizar
    ViaValidation.validaEstruturaFisica(viaData);
    return this.repository.updateVia(id, viaData, undefined, { strategy: reloadStrategy });
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

  getMontanha(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor?.face?.montanha || 
           estrutura.setor?.montanha || 
           estrutura.face?.montanha || 
           estrutura.montanha || 
           null;
  }

  getFace(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor?.face || estrutura.face || null;
  }

  getSetor(via: Via): any | null {
    const estrutura = this.getEstruturaFisica(via);
    if (!estrutura) return null;

    return estrutura.setor || null;
  }

  estaEmSetor(via: Via): boolean {
    return !!this.getSetor(via);
  }

  estaEmFace(via: Via): boolean {
    return !!this.getFace(via);
  }

  estaEmMontanha(via: Via): boolean {
    return !!this.getMontanha(via);
  }

  async deleteVia(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Busca vias de uma coleção.
   * 
   * @param colecaoId - ID da coleção
   * @param page - Número da página
   * @param limit - Itens por página
   * @param strategy - Estratégia de carregamento (default: LIST)
   */
  async getViasIdByColecaoId(colecaoId: number, page: number, limit: number, strategy: LoadStrategy = LoadStrategy.LIST) {
    return this.repository.getViasByColecaoId(colecaoId, page, limit, { strategy });
  }

  /**
   * Busca vias que NÃO estão em uma coleção do usuário.
   * 
   * @param colecaoId - ID da coleção
   * @param usuarioId - ID do usuário
   * @param page - Número da página
   * @param limit - Itens por página
   * @param strategy - Estratégia de carregamento (default: LIST)
   */
  async getViasNotInColecaoForUser(
    colecaoId: number,
    usuarioId: number,
    page: number,
    limit: number,
    strategy: LoadStrategy = LoadStrategy.LIST
  ) {
    if (!colecaoId || !usuarioId) {
      throw new BadRequestError("Parâmetros inválidos: colecaoId ou usuarioId ausentes.");
    }
    return this.repository.getViasNotInColecaoForUser(colecaoId, usuarioId, page, limit, { strategy });
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
