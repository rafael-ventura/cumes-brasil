import { AppDataSource } from "../config/db";
import { Montanha } from "../../Domain/entities/Montanha";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";
import {query} from "express";

export class MontanhaRepository implements ISearchRepository<Montanha> {
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

    search(query: any): Promise<Montanha[]> {
        return this.repository.createQueryBuilder("montanha")
            .leftJoinAndSelect("montanha.fonte", "fonte")
            .leftJoinAndSelect("montanha.imagem", "imagem")
            .where("montanha.nome like :nome", { nome: `%${query.nome}%` })
            .getMany();
    }

    count(query: any): Promise<number> {
        return Promise.resolve(0);
    }
}
