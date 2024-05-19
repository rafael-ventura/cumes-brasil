import { AppDataSource } from "../config/db";
import { Escalada } from "../../Domain/entities/Escalada";

export class EscaladaRepository {
    private repository = AppDataSource.getRepository(Escalada);

    async getById (id: number): Promise<Escalada | null> {
        return this.repository.findOne({ where: { id: id }, relations: ["via"]});
    }

    async getAll (): Promise<Escalada[]> {
        return this.repository.find({relations: ["via"]});
    }

    async create (escalada: Partial<Escalada>): Promise<void> {
        await this.repository.insert(escalada);
    }

    async update (id: number, escaladaData: Partial<Escalada>): Promise<void> {
        await this.repository.update(id as any, escaladaData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }

    async getByUserId (userId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { usuario_id: userId as any } });
    }

    async getByViaId (viaId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { via_id: viaId as any } });
    }
}
