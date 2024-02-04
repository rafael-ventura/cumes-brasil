import {FonteRepository} from "../../Infrastructure/repositories/FonteRepository";
import {Fonte} from "../../Domain/models/Fonte";

export class FonteService {
    private fonteRepository: FonteRepository;

    constructor(fonteRepository: FonteRepository) {
        this.fonteRepository = fonteRepository;
    }

    async getFonteById(id: number): Promise<Fonte | null> {
        return this.fonteRepository.getFonteById(id);
    }

    async getFontes(): Promise<Fonte[] | null> {
        return this.fonteRepository.getFontes();
    }

    async createFonte(fonte: Fonte): Promise<void> {
        return this.fonteRepository.createFonte(fonte);
    }

    async updateFonte(fonte: Fonte): Promise<void> {
        if (!await this.getFonteById(fonte.id)) {
            throw new Error("Fonte não encontrada");
        }
    }

    async deleteFonte(id: number): Promise<void> {
        if (!await this.getFonteById(id)) {
            throw new Error("Fonte não encontrada");
        }
    }
}