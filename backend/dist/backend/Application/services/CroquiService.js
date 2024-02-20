"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroquiService = void 0;
class CroquiService {
    constructor(croquiRepository) {
        this.croquiRepository = croquiRepository;
    }
    async getCroquiById(id) {
        return this.croquiRepository.getCroquiById(id);
    }
    async getCroquis() {
        return this.croquiRepository.getCroquis();
    }
    async createCroqui(croqui) {
        return this.croquiRepository.createCroqui(croqui);
    }
    async updateCroqui(croqui) {
        return this.croquiRepository.updateCroqui(croqui);
    }
    async deleteCroqui(id) {
        return this.croquiRepository.deleteCroqui(id);
    }
    async associarCroquiEmVia(croqui_id, via_id) {
        return this.croquiRepository.associarCroquiEmVia(croqui_id, via_id);
    }
    async desassociarCroquiEmVia(croqui_id, via_id) {
        return this.croquiRepository.desassociarCroquiEmVia(croqui_id, via_id);
    }
}
exports.CroquiService = CroquiService;
