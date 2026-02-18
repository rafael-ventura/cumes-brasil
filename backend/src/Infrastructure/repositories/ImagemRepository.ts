import { Service } from 'typedi';
import {Imagem} from "../../Domain/entities/Imagem";
import BaseRepository from "./BaseRepository";

/**
 * Repository para entidade Imagem.
 */
@Service()
export class ImagemRepository extends BaseRepository<Imagem> {
  protected entityTarget = Imagem;
  
  constructor() {
    super(Imagem);
  }

  /**
   * Cria nova imagem com limpeza de dados.
   * 
   * @param imagemData - Dados parciais da imagem
   * @returns Imagem criada
   * 
   * @example
   * ```typescript
   * const imagem = await repo.createNew({
   *   url: 'https://example.com/image.jpg',
   *   tipo_entidade: 'via',
   *   descricao: 'Vista da face norte'
   * });
   * ```
   */
  async createNew(imagemData: Partial<Imagem>): Promise<Imagem> {
    const cleanData: any = {
      url: imagemData.url,
      tipo_entidade: imagemData.tipo_entidade,
      descricao: imagemData.descricao
    };
    
    const result = await this.repository.insert(cleanData);
    const id = result.identifiers[0].id;
    return this.getById(id) as Promise<Imagem>;
  }

  /**
   * Busca imagem por entidade relacionada.
   * 
   * Método genérico que elimina duplicação de código.
   * Substitui: getByColecaoId, getByUsuarioId, getByMontanhaId, getByViaId, getByCroquiId
   * 
   * @param entityType - Tipo da entidade (colecao, usuario, montanha, via, croqui)
   * @param entityId - ID da entidade
   * @returns Imagem encontrada ou null
   * 
   * @throws Error se entityType for inválido
   * 
   * @example
   * ```typescript
   * // Buscar imagem de uma coleção
   * const imagem = await repo.getByEntity('colecao', 123);
   * 
   * // Buscar imagem de uma via
   * const imagem = await repo.getByEntity('via', 456);
   * 
   * // Buscar foto de perfil de usuário
   * const fotoPerfil = await repo.getByEntity('usuario', 789);
   * ```
   */
  async getByEntity(
    entityType: 'colecao' | 'usuario' | 'montanha' | 'via' | 'croqui',
    entityId: number
  ): Promise<Imagem | null> {
    const relationMap: Record<string, string> = {
      colecao: 'colecoes',
      usuario: 'usuarios',
      montanha: 'montanhas',
      via: 'vias',
      croqui: 'croquis'
    };
    
    const relation = relationMap[entityType];
    if (!relation) {
      throw new Error(
        `Tipo de entidade inválido: '${entityType}'. ` +
        `Tipos permitidos: ${Object.keys(relationMap).join(', ')}`
      );
    }
    
    return this.repository.findOne({ 
      where: { [relation]: { id: entityId } } as any 
    });
  }

  /**
   * Busca imagem padrão por tipo de entidade.
   * 
   * @param tipoEntidade - Tipo da entidade (via, montanha, usuario, etc)
   * @returns Imagem padrão ou null
   * 
   * @example
   * ```typescript
   * const imagemPadrao = await repo.getDefaultByTipoEntidade('via');
   * ```
   */
  async getDefaultByTipoEntidade(tipoEntidade: string): Promise<Imagem | null> {
    return this.repository.findOne({ 
      where: { tipo_entidade: tipoEntidade } as any 
    });
  }

  // ===== MÉTODOS DEPRECATED (mantidos para compatibilidade) =====
  // Usar getByEntity() em código novo

  /**
   * @deprecated Use getByEntity('colecao', colecaoId)
   */
  async getByColecaoId(colecaoId: number): Promise<Imagem | null> {
    return this.getByEntity('colecao', colecaoId);
  }

  /**
   * @deprecated Use getByEntity('usuario', usuarioId)
   */
  async getByUsuarioId(usuarioId: number): Promise<Imagem | null> {
    return this.getByEntity('usuario', usuarioId);
  }

  /**
   * @deprecated Use getByEntity('montanha', montanhaId)
   */
  async getByMontanhaId(montanhaId: number): Promise<Imagem | null> {
    return this.getByEntity('montanha', montanhaId);
  }

  /**
   * @deprecated Use getByEntity('via', viaId)
   */
  async getByViaId(viaId: number): Promise<Imagem | null> {
    return this.getByEntity('via', viaId);
  }

  /**
   * @deprecated Use getByEntity('croqui', croquiId)
   */
  async getByCroquiId(croquiId: number): Promise<Imagem | null> {
    return this.getByEntity('croqui', croquiId);
  }
}
