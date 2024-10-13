import { Imagem } from '../../Domain/entities/Imagem';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';

export class ImagemService {
  private imagemRepository: ImagemRepository;

  constructor (imagemRepository: ImagemRepository) {
    this.imagemRepository = imagemRepository;
  }

  async getById (id: number): Promise<Imagem | null> {
    let imagem;
    if (!id) {
      throw new Error("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da Imagem inválido");
    }
    imagem = await this.imagemRepository.getById(id);
    return imagem;
  }

  async getAll (): Promise<Imagem[]> {
    return this.imagemRepository.getAll();
  }

  async create (imagem: Imagem): Promise<void> {
    if (!imagem) {
      throw new Error("Imagem inválida");
    }
    return this.imagemRepository.create(imagem);
  }

  async update (id: number, imagemData: Partial<Imagem>): Promise<void> {
    if (!id) {
      throw new Error("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da Imagem inválido");
    }
    const existingImagem = await this.getById(id);
    if (!existingImagem) {
      throw new Error("Imagem não encontrada");
    }
    await this.imagemRepository.update(id, imagemData);
  }

  async delete (id: number): Promise<void> {
    if (!id) {
      throw new Error("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da Imagem inválido");
    }
    const existingImagem = await this.getById(id);
    if (!existingImagem) {
      throw new Error("Imagem não encontrada");
    }
    await this.imagemRepository.delete(id);
  }

  async getByColecaoId (colecaoId: number): Promise<Imagem | null> {
    return this.imagemRepository.getByColecaoId(colecaoId);
  }

  async getByUsuarioId (usuarioId: number): Promise<Imagem | null> {
    return this.imagemRepository.getByUsuarioId(usuarioId);
  }

  async getByMontanhaId (montanhaId: number): Promise<Imagem | null> {
    return this.imagemRepository.getByMontanhaId(montanhaId);
  }

  async getByViaId (viaId: number): Promise<Imagem | null> {
    return this.imagemRepository.getByViaId(viaId);
  }

  async getByCroquiId (croquiId: number): Promise<Imagem | null> {
    return this.imagemRepository.getByCroquiId(croquiId);
  }
}
