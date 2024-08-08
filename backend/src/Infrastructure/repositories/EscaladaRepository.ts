import { AppDataSource } from "../config/db";
import { Escalada } from "../../Domain/entities/Escalada";

export class EscaladaRepository {
    private repository = AppDataSource.getRepository(Escalada);

    async getById(id: number): Promise<Escalada | null> {
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.id = :id", { id })
            .getOne();
    }

    async getAll(): Promise<Escalada[]> {
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .getMany();
    }

    async createOrUpdate(escalada: Partial<Escalada>): Promise<void> {
        await this.repository.save(escalada);
    }


    async remove(escalada: Escalada): Promise<void> {
        await this.repository.remove(escalada);
    }

    async getByUserId(userId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { usuarioId: userId } });
    }

    async getByViaId(viaId: number): Promise<Escalada[]> {
        return this.repository.find({ where: { viaId: viaId } });
    }
}
