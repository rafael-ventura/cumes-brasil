import { getCustomRepository } from "typeorm";
import { ViaRepository } from "../repositories/ViaRepository";
import { Via } from "../entities/Via";

export class ViaService {

    private viaRepository: ViaRepository;

    constructor() {
        this.viaRepository = getCustomRepository(ViaRepository);
    }

    async getAllVias(take?: number, skip?: number): Promise<Via[]> {
        return await this.viaRepository.findAll(take, skip);
    }



    async getViaById(id: number): Promise<Via | null> {
        return await this.viaRepository.findById(id);
    }


    async createVia(viaData: Via): Promise<Via> {
        const via = this.viaRepository.create(viaData);
        return await this.viaRepository.save(via);
    }

    async updateVia(id: number, viaData: Via): Promise<Via | null> {
        await this.viaRepository.update(id, viaData);
        return this.getViaById(id);
    }

    async deleteVia(id: number): Promise<void> {
        await this.viaRepository.delete(id);
    }

    // Aqui, você pode adicionar qualquer outra lógica de negócios específica relacionada à entidade `Via`.
}
