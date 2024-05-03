"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroquiService = void 0;
class CroquiService {
    constructor(croquiRepository, viaRepository) {
        this.croquiRepository = croquiRepository;
        this.viaRepository = viaRepository;
    }
    async getCroquiById(id) {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        return this.croquiRepository.getById(id);
    }
    async getCroquis() {
        return this.croquiRepository.getAll();
    }
    async createCroqui(croqui) {
        if (!croqui) {
            throw new Error("Croqui inválido");
        }
        return this.croquiRepository.create(croqui);
    }
    async updateCroqui(id, croquiData) {
        if (!id) {
            throw new Error("ID do croqui não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.update(id, croquiData);
    }
    async deleteCroqui(id) {
        if (!id) {
            throw new Error("ID do croqui não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new Error("Croqui não encontrado");
        }
        await this.croquiRepository.delete(id);
    }
    async associarCroquiEmVia(croqui_id, via_id) {
        if (!via_id || !croqui_id) {
            throw new Error("Erro na passagem de Ids. Id inválido");
        }
        const croquiViaExiste = await this.croquiRepository.getCroquisIdsByViaId(via_id);
        if (croquiViaExiste) {
            throw new Error("Croqui já associado a esta via");
        }
        return this.croquiRepository.associarCroquiVia(croqui_id, via_id);
    }
    async desassociarCroquiEmVia(croqui_id, via_id) {
        if (!via_id || !croqui_id) {
            throw new Error("Erro na passagem de Ids. Id inválido");
        }
        const croquiViaExiste = await this.croquiRepository.getCroquisIdsByViaId(via_id);
        if (!croquiViaExiste) {
            throw new Error("Croqui não associado a esta via");
        }
        return this.croquiRepository.desassociarCroquiVia(croqui_id, via_id);
    }
    async getCroquisIdsByViaId(id) {
        return this.croquiRepository.getCroquisIdsByViaId(id);
    }
    async getCroquisByViaId(id) {
        return this.croquiRepository.getCroquisByViaId(id);
    }
}
exports.CroquiService = CroquiService;
