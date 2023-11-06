// ViaService.ts
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { IVia } from '../../Domain/interfaces/IVia';

export class ViaService {
    private repo: ViaRepository;

    constructor(repo: ViaRepository) {
        this.repo = repo;
    }

    async getViaById(id: string): Promise<IVia | null> {
        // Here you can include business logic before fetching the via
        return this.repo.getById(id);
    }

    async getAllVias(): Promise<IVia[]> {
        // Here you can include business logic before fetching all vias
        return this.repo.getAll();
    }

    async findDetailedById(id: string): Promise<IVia | null> {
        // Here you can include business logic before fetching the detailed via
        return this.repo.findDetailedById(id);
    }

    // Additional methods can be implemented here
    // For example, createVia, updateVia, deleteVia, etc.
}

// Depending on how you want to structure your application, you might have to adapt this code.
