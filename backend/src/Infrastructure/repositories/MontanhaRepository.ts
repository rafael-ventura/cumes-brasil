import { Montanha } from "../../Domain/entities/Montanha";
import { BaseRepository } from "./BaseRepository";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";

export class MontanhaRepository extends BaseRepository<Montanha> implements ICrudRepository<Montanha> {
    constructor() {
        super(Montanha);
    }

    async getById(id: number, relations?: string[]): Promise<Montanha | null> {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagem", "imagem")
            .where("montanha.id = :id", { id })
            .getOne();
    }

    async getAll(): Promise<Montanha[]> {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagem", "imagem")
            .getMany();
    }
}
