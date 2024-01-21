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
        return this.fonteRepository.updateFonte(fonte);
    }

    async deleteFonte(id: number): Promise<void> {
        return this.fonteRepository.deleteFonte(id);
    }
}