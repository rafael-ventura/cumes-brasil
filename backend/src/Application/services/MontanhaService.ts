import { Montanha } from "../../Domain/entities/Montanha";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import BaseService from "./BaseService";

export class MontanhaService extends BaseService<Montanha, MontanhaRepository> {

    constructor(montanhaRepository: MontanhaRepository) {
        super(montanhaRepository);
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        return this.repository.getById(id);
    }

    async getMontanhas(): Promise<Montanha[]> {
        return this.repository.getAll();
    }
}
