import { Imagem } from "../../Domain/entities/Imagem";
import { ImagemRepository } from "../../Infrastructure/repositories/ImagemRepository";

export class ImagemService {
  private imagemRepository: ImagemRepository;

  constructor (imagemRepository: ImagemRepository) {
    this.imagemRepository = imagemRepository;
  }

  async getImagemById (id: number
  ): Promise<Imagem | null> {
    if (!id) {
      throw new Error("ID da imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da imagem inválido");
    }
    return this.imagemRepository.getById(id);
  }

  async getImagens (): Promise<Imagem[]> {
    return this.imagemRepository.getAll();
  }

  async createImagem (imagem: Imagem): Promise<void> {
    if (!imagem) {
      throw new Error("Imagem inválida");
    }
    return this.imagemRepository.create(imagem);
  }

  async updateImagem (id: number, imagemData: Partial<Imagem>): Promise<void> {
    if (!id) {
      throw new Error("ID da imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da imagem inválido");
    }
    const existingImagem = await this.getImagemById(id);
    if (!existingImagem) {
      throw new Error("Imagem não encontrada");
    }
    await this.imagemRepository.update(id, imagemData);
  }

  async deleteImagem (id: number): Promise<void> {
    if (!id) {
      throw new Error("ID da imagem não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da imagem inválido");
    }
    const existingImagem = await this.getImagemById(id);
    if (!existingImagem) {
      throw new Error("Imagem não encontrada");
    }
    await this.imagemRepository.delete(id);
  }

}

