import { Imagem } from '../../Domain/entities/Imagem';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import BaseService from './BaseService';

export class ImagemService extends BaseService<Imagem, ImagemRepository> {

  constructor (imagemRepository: ImagemRepository) {
    super(imagemRepository);
  }

  async getById (id: number): Promise<Imagem | null> {
    let imagem;
    if (!id) {
      throw new BadRequestError("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new BadRequestError("ID da Imagem inválido");
    }
    imagem = await this.repository.getById(id);
    return imagem;
  }

  async getAll (): Promise<Imagem[]> {
    return this.repository.getAll();
  }

  async create (imagem: Imagem): Promise<Imagem> {
    if (!imagem) {
      throw new BadRequestError("Imagem inválida");
    }
    return this.repository.create(imagem);
  }

  async update (id: number, imagemData: Partial<Imagem>): Promise<Imagem | null> {
    if (!id) {
      throw new BadRequestError("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new BadRequestError("ID da Imagem inválido");
    }
    const existingImagem = this.ensureExists(await this.getById(id), "Imagem não encontrada");
    await this.repository.update(id, imagemData);
    return this.getById(id);
  }

  async delete (id: number): Promise<void> {
    if (!id) {
      throw new BadRequestError("ID da Imagem não fornecido");
    } else if (isNaN(id)) {
      throw new BadRequestError("ID da Imagem inválido");
    }
    const existingImagem = this.ensureExists(await this.getById(id), "Imagem não encontrada");
    await this.repository.delete(id);
  }

  async getByColecaoId (colecaoId: number): Promise<Imagem | null> {
    return this.repository.getByColecaoId(colecaoId);
  }

  async getByUsuarioId (usuarioId: number): Promise<Imagem | null> {
    return this.repository.getByUsuarioId(usuarioId);
  }

  async getByMontanhaId (montanhaId: number): Promise<Imagem | null> {
    return this.repository.getByMontanhaId(montanhaId);
  }

  async getByViaId (viaId: number): Promise<Imagem | null> {
    return this.repository.getByViaId(viaId);
  }

  async getImagensByViaId (viaId: number): Promise<Imagem[]> {
    return this.repository.getImagensByViaId(viaId);
  }

  async getByCroquiId (croquiId: number): Promise<Imagem | null> {
    return this.repository.getByCroquiId(croquiId);
  }
}
