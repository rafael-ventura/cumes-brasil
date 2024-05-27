import { Imagem } from "../../Domain/entities/Imagem";
import { AppDataSource } from "../config/db";

export class ImagemRepository {
  private repository = AppDataSource.getRepository(Imagem);

  async getById (id: number): Promise<Imagem | null> {
    return this.repository.createQueryBuilder("imagem")
      .leftJoinAndSelect("imagem.fonte", "fonte")
      .where("imagem.id = :id", { id })
      .getOne();
  }

  async getAll (): Promise<Imagem[]> {
    return this.repository.createQueryBuilder("imagem")
      .leftJoinAndSelect("imagem.fonte", "fonte")
      .getMany();
  }

  async create (imagem: Partial<Imagem>): Promise<void> {
    await this.repository.insert(imagem);
  }

  async update (id: number, imagemData: Partial<Imagem>): Promise<void> {
    await this.repository.update(id, imagemData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getByColecaoId (colecaoId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { colecoes: { id: colecaoId } } });
  }

  async getByUsuarioId (usuarioId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { usuarios: { id: usuarioId } } });
  }

  async getByMontanhaId (montanhaId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { montanhas: { id: montanhaId } } });
  }

  async getByViaId (viaId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { vias: { id: viaId } } });
  }

  async getByCroquiId (croquiId: number): Promise<Imagem | null> {
    return this.repository.findOne({ where: { croquis: { id: croquiId } } });
  }
}
