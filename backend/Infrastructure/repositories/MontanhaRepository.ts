import { AppDataSource } from "../config/db";
import { Montanha } from "../../Domain/entities/Montanha";

export class MontanhaRepository {
    private repository = AppDataSource.getRepository(Montanha);

    async getById (id: number): Promise<Montanha | null> {
        return this.repository.findOne({ where: { id: id } });
    }

    async getAll (): Promise<Montanha[]> {
        return this.repository.find();
    }

    async create (montanha: Partial<Montanha>): Promise<void> {
        await this.repository.insert(montanha);
    }

    async update (id: number, montanhaData: Partial<Montanha>): Promise<void> {
        await this.repository.update(id as any, montanhaData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }
}
