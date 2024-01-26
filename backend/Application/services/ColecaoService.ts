import { ColecaoBaseRepository } from "../../Infrastructure/repositories/ColecaoBaseRepository";
import { ColecaoBase } from "../../Domain/models/ColecaoBase";
import { Usuario } from "../../Domain/models/Usuario";

export class ColecaoService {
    private repository: ColecaoBaseRepository;

    constructor(repository: ColecaoBaseRepository){
        this.repository = repository;
    }

    async getColecaoBaseById(id: number): Promise<ColecaoBase | null> {
        return this.repository.getColecaoBaseById(id);
    }

    async getColecoesBase(): Promise<ColecaoBase[] | null> {
        return this.repository.getColecoesBase();
    }

    async createColecaoBase(colecaoBase: ColecaoBase): Promise<void> {
        return this.repository.createColecaoBase(colecaoBase);
    }

    async updateColecaoBase(colecaoBase: ColecaoBase): Promise<void> {
        return this.repository.updateColecaoBase(colecaoBase);
    }

    async deleteColecaoBase(id: number): Promise<void> {
        return this.repository.deleteColecaoBase(id);
    }


}