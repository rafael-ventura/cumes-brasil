import { Fonte } from "../../Domain/entities/Fonte";
import { AppDataSource } from "../config/db";

export class FonteRepository {
    private repository = AppDataSource.getRepository(Fonte);

    async getById (id: number): Promise<Fonte | null> {
        return this.repository.findOne(
          {
              where: { id: id }
          });
    }

    async getAll (): Promise<Fonte[]> {
        return this.repository.find();
    }

    async create (fonte: Partial<Fonte>): Promise<void> {
        await this.repository.insert(fonte);
    }

    async update (id: number, fonteData: Partial<Fonte>): Promise<void> {
        await this.repository.update(id as any, fonteData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }
}
