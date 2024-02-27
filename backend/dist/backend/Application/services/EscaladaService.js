"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaService = void 0;
class EscaladaService {
    constructor(repository) {
        this.repository = repository;
    }
    async getEscaladaById(id) {
        return this.repository.getEscaladaById(id);
    }
    async getEscaladas() {
        return this.repository.getEscaladas();
    }
    async createEscalada(escalada) {
        return this.repository.createEscalada(escalada);
    }
    async updateEscalada(escalada) {
        return this.repository.updateEscalada(escalada);
    }
    async deleteEscalada(id) {
        return this.repository.deleteEscalada(id);
    }
    async getEscaladasDoUsuario(usuario_id) {
        return this.repository.getEscaladasDoUsuario(usuario_id);
    }
}
exports.EscaladaService = EscaladaService;
