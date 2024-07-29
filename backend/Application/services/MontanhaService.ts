import { Montanha } from "../../Domain/entities/Montanha";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";

export class MontanhaService {
    private montanhaRepository: MontanhaRepository;

    constructor(montanhaRepository: MontanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        return this.montanhaRepository.getById(id);
    }

    async getMontanhas(): Promise<Montanha[]> {
        return this.montanhaRepository.getAll();
    }
}
