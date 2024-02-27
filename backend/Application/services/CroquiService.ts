import { Croqui } from "../../Domain/models/Croqui";
import { CroquiRepository } from "../../Infrastructure/repositories/CroquiRepository";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { ViaService } from "./ViaService";

export class CroquiService {
    private croquiRepository: CroquiRepository;
    private viaRepository: ViaRepository;

    constructor(croquiRepository: CroquiRepository , viaRepository: ViaRepository) {
        this.croquiRepository = croquiRepository;
        this.viaRepository = viaRepository;
    }


    async getCroquiById(id: number): Promise<Croqui | null> {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        const response = await this.croquiRepository.getCroquiById(id);
        if (response === null) {
            throw new Error("Croqui não encontrada");
        }
        return response;
    }

    async getCroquis(): Promise<Croqui[] | null> {
        const croquis = await this.croquiRepository.getCroquis();
        if (!croquis) {
            throw new Error("Nenhum croqui encontrado");
        }
        return croquis;
    }

    async createCroqui(croqui: Croqui): Promise<void> {
        if (!croqui) {
            throw new Error("Croqui inválido");
        }
        await this.croquiRepository.createCroqui(croqui);
    }

    async updateCroqui(croqui: Croqui): Promise<void> {
        if (!croqui) {
            throw new Error("Croqui inválido");
        }
        const croquiExists = await this.croquiRepository.getCroquiById(croqui.id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        const response = this.croquiRepository.updateCroqui(croqui);
        if (!response) {
            throw new Error("Erro ao atualizar croqui");
        }
        await response;
    }

    async deleteCroqui(id: number): Promise<void> {
        const croquiExists = await this.croquiRepository.getCroquiById(id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.deleteCroqui(id);
    }

    async associarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        if (!via_id || !croqui_id) {
            throw new Error("Erro na passagem de Ids. Id inválido");
        }
        const croquiExists = await this.croquiRepository.getCroquiById(croqui_id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        const viaExists = await this.viaRepository.getViaById(via_id);
        if (!viaExists) {
            throw new Error("Via não encontrada");
        }
        const response = this.croquiRepository.associarCroquiEmVia(croqui_id, via_id);
        if (!response) {
            throw new Error("Erro ao associar croqui em via");
        }
        await response ;
    }

    async desassociarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        if (!via_id || !croqui_id) {
            throw new Error("Erro na passagem de Ids. Id inválido");
        }
        const croquiViaExiste = await this.croquiRepository.getCroquisIdsByViaId(via_id);
        if (!croquiViaExiste) {
            throw new Error("Croqui associado não encontrado para esta via");
        }
        const response = this.croquiRepository.desassociarCroquiEmVia(croqui_id, via_id);
        if (!response) {
            throw new Error("Erro ao desassociar croqui em via");
        }
        await response;
    }

    async getCroquisIdsByViaId(via_id: number): Promise<number[] | null> {
        const croquisIds = await this.croquiRepository.getCroquisIdsByViaId(via_id);
        if (!croquisIds) {
            throw new Error("Nenhum ID de croqui encontrado para esta via");
        }
        return croquisIds;
    }
}