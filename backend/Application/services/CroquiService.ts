import {Croqui} from "../../Domain/models/Croqui";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";

export class CroquiService {
    private croquiRepository: CroquiRepository;

    constructor(croquiRepository: CroquiRepository) {
        this.croquiRepository = croquiRepository;
    }

    async getCroquiById(id: number): Promise<Croqui | null> {
        return this.croquiRepository.getCroquiById(id);
    }

    async getCroquis(): Promise<Croqui[] | null> {
        return this.croquiRepository.getCroquis();
    }

    async createCroqui(croqui: Croqui): Promise<void> {
        return this.croquiRepository.createCroqui(croqui);
    }

    async updateCroqui(croqui: Croqui): Promise<void> {
        return this.croquiRepository.updateCroqui(croqui);
    }

    async deleteCroqui(id: number): Promise<void> {
        return this.croquiRepository.deleteCroqui(id);
    }

    async associarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        return this.croquiRepository.associarCroquiEmVia(croqui_id, via_id);
    }

    async desassociarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        return this.croquiRepository.desassociarCroquiEmVia(croqui_id, via_id);
    }
}