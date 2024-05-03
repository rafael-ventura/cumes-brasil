import { Montanha } from "../../Domain/entities/Montanha";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";

export class MontanhaService {
    private montanhaRepository: MontanhaRepository;

    constructor (montanhaRepository: MontanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }

    async getMontanhaById (id: number): Promise<Montanha | null> {
        return this.montanhaRepository.getById(id);
    }

    async getMontanhas (): Promise<Montanha[]> {
        return this.montanhaRepository.getAll();
    }

    async createMontanha (montanha: Montanha): Promise<void> {
        return this.montanhaRepository.create(montanha);
    }

    async updateMontanha (id: number, montanhaData: Partial<Montanha>): Promise<void> {
        await this.montanhaRepository.update(id, montanhaData);
    }

    async deleteMontanha (id: number): Promise<void> {
        await this.montanhaRepository.delete(id);
    }
}
