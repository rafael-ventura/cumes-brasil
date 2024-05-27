import { Croqui } from "../../Domain/entities/Croqui";
import { CroquiRepository } from "../../Infrastructure/repositories/CroquiRepository";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { ObjectLiteral } from "typeorm";

export class CroquiService {
    private croquiRepository: CroquiRepository;
    private viaRepository: ViaRepository;

    constructor (croquiRepository: CroquiRepository, viaRepository: ViaRepository) {
        this.croquiRepository = croquiRepository;
        this.viaRepository = viaRepository;
    }

    async getCroquiById (id: number): Promise<Croqui | null> {
        if (!id) {
            throw new Error("ID da Fonte não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da Fonte inválido");
        }
        return this.croquiRepository.getById(id);
    }

    async getCroquis (): Promise<Croqui[]> {
        return this.croquiRepository.getAll();
    }

    async createCroqui (croqui: Croqui): Promise<void> {
        if (!croqui) {
            throw new Error("Croqui inválido");
        }
        return this.croquiRepository.create(croqui);
    }

    async updateCroqui (id: number, croquiData: Partial<Croqui>): Promise<void> {
        if (!id) {
            throw new Error("ID do croqui não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.update(id, croquiData);
    }

    async deleteCroqui (id: number): Promise<void> {
        if (!id) {
            throw new Error("ID do croqui não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.delete(id);
    }

    async associarCroquiEmVia (croqui_id: number, via_id: number): Promise<void> {
        return this.croquiRepository.associarVia(croqui_id, via_id);
    }

    async desassociarCroquiEmVia (croqui_id: number, via_id: number): Promise<void> {
        return this.croquiRepository.desassociarVia(croqui_id, via_id);
    }
    async getCroquisByViaId (id: number): Promise<ObjectLiteral[]> {
        return this.croquiRepository.getByViaId(id);
    }

}
