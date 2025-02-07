import {Croqui} from "../../Domain/entities/Croqui";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {ViaCroquiRepository} from "../../Infrastructure/repositories/ViaCroquiRepository";

export class CroquiService {
    private croquiRepository: CroquiRepository;
    private viaRepository: ViaRepository;
    private viaCroquiRepository: ViaCroquiRepository;

    constructor(croquiRepository: CroquiRepository, viaRepository: ViaRepository, viaCroquiRepository: ViaCroquiRepository) {
        this.croquiRepository = croquiRepository;
        this.viaRepository = viaRepository;
        this.viaCroquiRepository = viaCroquiRepository;
    }

    async getCroquiById (id: number): Promise<Croqui | null> {
        const croqui = await this.croquiRepository.getById(id);
        if (!id) {
            throw new Error("ID da Fonte não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da Fonte inválido");
        }
        return croqui;
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

    async associarCroquiEmVia (croquiId: number, viaId: number): Promise<void> {
        return this.viaCroquiRepository.associar({croqui: {id: croquiId}, via: {id: viaId}});
    }

    async desassociarCroquiEmVia (croquiId: number, viaId: number): Promise<void> {
        return this.viaCroquiRepository.desassociar(croquiId, viaId);
    }
    async getCroquisByViaId (id: number): Promise<Croqui[]> {
        return this.croquiRepository.getByViaId(id);
    }

}
