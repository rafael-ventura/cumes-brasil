import { AppDataSource } from "../config/db";
import { ViaCroqui } from "../../Domain/entities/ViaCroqui";

export class ViaCroquiRepository {
  private repository = AppDataSource.getRepository(ViaCroqui);

  async getById(id: number): Promise<ViaCroqui | null> {
    return this.repository.findOne({ where: { id } });
  }

  async getAll(): Promise<ViaCroqui[]> {
    return this.repository.find();
  }

  async create(viaCroqui: Partial<ViaCroqui>): Promise<void> {
    await this.repository.insert(viaCroqui);
  }

  async update(id: number, viaCroquiData: Partial<ViaCroqui>): Promise<void> {
    await this.repository.update(id, viaCroquiData);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async associar(viaCroquiData: { via: { id: number }, croqui: { id: number } }): Promise<void> {
    const viaCroqui = this.repository.create(viaCroquiData);
    await this.repository.insert(viaCroqui);
  }

  async desassociar(croquiId: number, viaId: number): Promise<void> {
    await this.repository.delete({ via: { id: viaId }, croqui: { id: croquiId } });
  }
}
