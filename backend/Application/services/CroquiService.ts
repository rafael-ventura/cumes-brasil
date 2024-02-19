import {Croqui} from "../../Domain/models/Croqui";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";

export class CroquiService {
    private croquiRepository: CroquiRepository;

    constructor(croquiRepository: CroquiRepository) {
        this.croquiRepository = croquiRepository;
    }

    async getCroquiById(id: number): Promise<Croqui | null> {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
    
        try {
            const croqui = await this.croquiRepository.getCroquiById(id);
            return croqui;
        } catch (error) {
            // Se a croqui não for encontrada, retornar null em vez de lançar uma exceção
            if ((error as Error).message === "Croqui não encontrada") {
                return null;
            }
            // Se ocorrer outro tipo de erro, relançar a exceção
            throw error;
        }
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
        const croquiExists = await this.getCroquiById(croqui.id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.updateCroqui(croqui);
    }

    async deleteCroqui(id: number): Promise<void> {
        const croquiExists = await this.getCroquiById(id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.deleteCroqui(id);
    }

    async associarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        const croquiExists = await this.getCroquiById(croqui_id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        // Validação adicional pode ser necessária aqui para verificar se a via existe
        await this.croquiRepository.associarCroquiEmVia(croqui_id, via_id);
    }

    async desassociarCroquiEmVia(croqui_id: number, via_id: number): Promise<void> {
        const croquiExists = await this.getCroquiById(croqui_id);
        if (!croquiExists) {
            throw new Error("Croqui não encontrado");
        }
        // Validação adicional pode ser necessária aqui para verificar se a via existe
        await this.croquiRepository.desassociarCroquiEmVia(croqui_id, via_id);
    }

    async getCroquisIdsByViaId(via_id: number): Promise<number[] | null> {
        const croquisIds = await this.croquiRepository.getCroquisIdsByViaId(via_id);
        if (!croquisIds) {
            throw new Error("Nenhum ID de croqui encontrado para esta via");
        }
        return croquisIds;
    }
}