import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { Via } from "../../Domain/entities/Via";

export class ViaService {
    private viaRepo: ViaRepository;

    constructor (viaRepo: ViaRepository) {
        this.viaRepo = viaRepo;
    }

    async getViaById (id: number): Promise<Via | null> {
        return this.viaRepo.getById(id);
    }

    async getVias (): Promise<Via[]> {
        return this.viaRepo.getAll();
    }

    async createVia (viaData: Partial<Via>): Promise<void> {
        return this.viaRepo.create(viaData);
    }

    async updateVia (id: number, viaData: Partial<Via>): Promise<void> {
        await this.viaRepo.update(id, viaData);
    }

    async deleteVia (id: number): Promise<void> {
        await this.viaRepo.delete(id);
    }

    async addCroquiToVia (viaId: number, croquiId: number): Promise<void> {
        await this.viaRepo.addCroqui(viaId, croquiId);
    }

    async removeCroquiFromVia (viaId: number, croquiId: number): Promise<void> {
        await this.viaRepo.removeCroqui(viaId, croquiId);
    }

    async getViasIdByColecaoId (colecaoId: number): Promise<number[]> {
        return this.viaRepo.getViasIdByColecaoId(colecaoId);
    }
}
