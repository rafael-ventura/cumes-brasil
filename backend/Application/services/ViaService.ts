import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {Via} from '../../Domain/models/Via';

export class ViaService {
    private repository: ViaRepository;

    constructor(repository: ViaRepository) {
        this.repository = repository;
    }

    async getViaById(id: number): Promise<Via | null> {
        return this.repository.getViaById(id);
    }

    async getVias(): Promise<Via[] | null> {
        return this.repository.getVias();
    }

    async createVia(via: Via): Promise<void> {
        return this.repository.createVia(via);
    }

    async updateVia(via: Via): Promise<void> {
        if (!await this.getViaById(via.id)) {
            throw new Error("Via não encontrada");
        }
        return this.repository.updateVia(via);
    }

    async deleteVia(id: number): Promise<void> {
        if (!await this.getViaById(id)) {
            throw new Error("Via não encontrada");
        }
        return this.repository.deleteVia(id);
    }
}
