import { AppDataSource } from "../config/db";
import { Escalada } from "../../Domain/entities/Escalada";

export class EscaladaRepository {
    private repository = AppDataSource.getRepository(Escalada);

    async getById (id: number): Promise<Escalada | null> {
        return this.repository.findOne({ where: { id: id } });
    }

    async getAll (): Promise<Escalada[]> {
        return this.repository.find();
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

    async getEscaladasByUserId (userId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { usuario: userId as any } });
    }

    async getEscaladasByViaId (viaId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { usuario: viaId as any } });
    }
}
