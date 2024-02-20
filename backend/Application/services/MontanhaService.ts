import { Montanha } from "../../Domain/models/Montanha";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { FonteService } from "./FonteService";

export class MontanhaService {
    private montanhaRepository: MontanhaRepository;
    private fonteService?: FonteService;

    constructor(montanhaRepository: MontanhaRepository, fonteService: FonteService) {
        this.montanhaRepository = montanhaRepository;
        this.fonteService = fonteService;
    }

    async getMontanhaById(id: number): Promise<Montanha | null> {
        if (!id) {
            throw new Error("ID da montanha não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da montanha inválido");
        }
        const montanha = await this.montanhaRepository.getMontanhaById(id);
        if (!montanha) {
            throw new Error("Montanha não encontrada");
        }
        return montanha;

    }

    async getMontanhas(): Promise<Montanha[] | null> {
        const montanhas = await this.montanhaRepository.getMontanhas();
        if (!montanhas) {
            throw new Error("Nenhuma montanha encontrada");
        }
        return montanhas;
    }

    async createMontanha(montanha: Montanha): Promise<void> {
        
        const existingFonte = await this.fonteService?.getFonteById(montanha.fonte_id);
        if (!existingFonte) {
            throw new Error("Fonte não encontrada");
        }
        const result = await this.montanhaRepository.createMontanha(montanha);
        if (result === null) {
            throw new Error("Erro ao criar montanha");
        }
        return result;
    }

    async updateMontanha(montanha: Montanha): Promise<void> {
        if (!montanha.id) {
            throw new Error("ID da montanha não fornecido");
        }
        const montanhaExiste = await this.montanhaRepository.getMontanhaById(montanha.id);
        if (!montanhaExiste) {
            throw new Error("Montanha não encontrada");
        }
        const existingFonte = await this.fonteService?.getFonteById(montanha.fonte_id);
        if (!existingFonte) {
            throw new Error("Fonte não encontrada");
        }
        
        const result = await this.montanhaRepository.updateMontanha(montanha);
        if (result === null) {
            throw new Error("Erro ao atualizar montanha");
        }
        return result;
    }

    async deleteMontanha(id: number): Promise<void> {
        if (!id) {
            throw new Error("ID da montanha não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da montanha inválido");
        }
        const existingMontanha = await this.montanhaRepository.getMontanhaById(id);
        if (!existingMontanha) {
            throw new Error("Montanha não encontrada");
        }

        const result = await this.montanhaRepository.deleteMontanha(id);
        if (result === null) {
            throw new Error("Erro ao deletar montanha");
        }
        return result;
    }
}
