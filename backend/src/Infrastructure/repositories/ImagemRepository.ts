import {Imagem} from "../../Domain/entities/Imagem";
import BaseRepository from "./BaseRepository";

export class ImagemRepository extends BaseRepository<Imagem> {
  constructor() {
    super(Imagem);
  }

  // Método para criar nova imagem garantindo INSERT (não UPDATE)
  async createNew(imagemData: Partial<Imagem>): Promise<Imagem> {
    // Criar objeto completamente limpo sem nenhuma referência
    const cleanData: any = {
      url: imagemData.url,
      tipo_entidade: imagemData.tipo_entidade,
      descricao: imagemData.descricao
    };
    
    const result = await this.repository.insert(cleanData);
    const id = result.identifiers[0].id;
    return this.getById(id) as Promise<Imagem>;
  }

  // Métodos específicos abaixo

  async getByColecaoId (colecaoId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { colecoes: { id: colecaoId } } as any });
  }

  async getByUsuarioId (usuarioId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { usuarios: { id: usuarioId } } as any });
  }

  async getByMontanhaId (montanhaId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { montanhas: { id: montanhaId } } as any });
  }

  async getImagensByViaId (viaId: number): Promise<Imagem[]> {
    const { ViaImagem } = await import('../../Domain/entities/ViaImagem');
    const viaImagemRepo = this.repository.manager.getRepository(ViaImagem);
    const viasImagens = await viaImagemRepo.find({
      where: { via: { id: viaId } },
      relations: ['imagem']
    });
    return viasImagens.map(vi => vi.imagem).filter(Boolean) as Imagem[];
  }

  /** Retorna primeira imagem da via (compatibilidade). */
  async getByViaId (viaId: number): Promise<Imagem | null> {
    const imagens = await this.getImagensByViaId(viaId);
    return imagens.length > 0 ? imagens[0] : null;
  }

  async getByCroquiId (croquiId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { croquis: { id: croquiId } } as any });
  }

  async getDefaultByTipoEntidade (tipoEntidade: string): Promise<Imagem | null> {
    return this.repository.findOne({ 
      where: { tipo_entidade: tipoEntidade } as any 
    });
  }
}
