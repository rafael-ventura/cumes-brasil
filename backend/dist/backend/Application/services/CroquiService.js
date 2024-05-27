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
        return this.croquiRepository.associarVia(croqui_id, via_id);
    }
    async desassociarCroquiEmVia(croqui_id, via_id) {
        return this.croquiRepository.desassociarVia(croqui_id, via_id);
    }
    async getCroquisIdsByViaId(id) {
        return this.croquiRepository.getIdsByViaId(id);
    }
    async getCroquisByViaId(id) {
        return this.croquiRepository.getByViaId(id);
    }
}
exports.CroquiService = CroquiService;
