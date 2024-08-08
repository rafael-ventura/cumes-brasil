import { AppDataSource } from "../config/db";
import { Montanha } from "../../Domain/entities/Montanha";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";
import {query} from "express";

export class MontanhaRepository {
    private repository = AppDataSource.getRepository(Montanha);

    async getById(id: number): Promise<Montanha | null> {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagem", "imagem") // Correção aqui
            .where("montanha.id = :id", { id })
            .getOne();
    }

    async getAll(): Promise<Montanha[]> {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagem", "imagem") // Correção aqui
            .getMany();
    }
}
