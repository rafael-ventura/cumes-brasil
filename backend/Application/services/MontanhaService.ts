import { Montanha } from "../../Domain/models/Montanha";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";

export class MontanhaService {
    private montanhaRepository: MontanhaRepository;

    constructor(montanhaRepository: MontanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        if (!id) {
            throw new Error("ID da montanha não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da montanha inválido");
        }

        try {
            const montanha = await this.montanhaRepository.getMontanhaById(id);
            return montanha;
        } catch (error) {
            // Se a montanha não for encontrada, retornar null em vez de lançar uma exceção
            if ((error as Error).message === "Montanha não encontrada") {
                return null;
            }
            // Se ocorrer outro tipo de erro, relançar a exceção
            throw error;
        }
    }

    async getMontanhas(): Promise<Montanha[] | null> {
        const montanhas = await this.montanhaRepository.getMontanhas();
        if (!montanhas) {
            throw new Error("Nenhuma montanha encontrada");
        }
        return montanhas;
    }

    async createMontanha(montanha: Montanha): Promise<void> {
        // Adicione suas regras de validação aqui antes de criar a montanha
        return this.montanhaRepository.createMontanha(montanha);
    }

    async updateMontanha(montanha: Montanha): Promise<void> {
        if (!montanha.id) {
            throw new Error("ID da montanha não fornecido");
        }
        const montanhaExiste = await this.getMontanhaById(montanha.id);
        if (!montanhaExiste) {
            throw new Error("Montanha não encontrada");
        }
        // Adicione suas regras de validação aqui antes de atualizar a montanha
        return this.montanhaRepository.updateMontanha(montanha);
    }

    async deleteMontanha(id: number): Promise<void> {
        if (!id) {
            throw new Error("ID da montanha não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da montanha inválido");
        }
        const existingMontanha = await this.getMontanhaById(id);
        if (!existingMontanha) {
            throw new Error("Montanha não encontrada");
        }
        return this.montanhaRepository.deleteMontanha(id);
    }
}
