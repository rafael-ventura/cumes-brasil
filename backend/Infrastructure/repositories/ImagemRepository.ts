import { Imagem } from "../../Domain/entities/Imagem";
import { AppDataSource } from "../config/db";

export class ImagemRepository {
  private repository = AppDataSource.getRepository(Imagem);

  async getById (id: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { id: id } });
  }

  async getAll (): Promise<Imagem[]> {
    return this.repository.find();
  }

  async create (imagem: Partial<Imagem>): Promise<void> {
    await this.repository.insert(imagem);
  }

  async update (id: number, imagemData: Partial<Imagem>): Promise<void> {
    await this.repository.update(id as any, imagemData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id as any);
  }

}
