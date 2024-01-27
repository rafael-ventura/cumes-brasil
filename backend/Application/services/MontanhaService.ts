import {Montanha} from "../../Domain/models/Montanha";
import {MontanhaRepository} from "../../Infrastructure/repositories/MontanhaRepository";

export class MontanhaService {
    private montanhaRepository: MontanhaRepository;

    constructor(montanhaRepository: MontanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        return this.montanhaRepository.getMontanhaById(id);
    }

    async getMontanhas(): Promise<Montanha[] | null> {
        return this.montanhaRepository.getMontanhas();
    }

    async createMontanha(montanha: Montanha): Promise<void> {
        return this.montanhaRepository.createMontanha(montanha);
    }

    async updateMontanha(montanha: Montanha): Promise<void> {
        if (!await this.getMontanhaById(montanha.id)) {
            throw new Error("Montanha não encontrada");
        }
        return this.montanhaRepository.updateMontanha(montanha);
    }

    async deleteMontanha(id: number): Promise<void> {
        if (!await this.getMontanhaById(id)) {
            throw new Error("Montanha não encontrada");
        }
        return this.montanhaRepository.deleteMontanha(id);


    }
}