import { Montanha } from "../../Domain/entities/Montanha";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { LoadStrategy } from "../../Domain/enum/ELoadStrategy";
import BaseService from "./BaseService";
import { Service } from 'typedi';

@Service()
export class MontanhaService extends BaseService<Montanha, MontanhaRepository> {

    constructor(montanhaRepository: MontanhaRepository) {
        super(montanhaRepository);
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        return this.repository.getById(id, { strategy: LoadStrategy.DETAIL });
    }

    async getMontanhas(): Promise<Montanha[]> {
        return this.repository.getAll({ strategy: LoadStrategy.LIST });
    }
}
