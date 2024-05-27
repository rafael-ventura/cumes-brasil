"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaService = void 0;
class ViaService {
    constructor(viaRepo) {
        this.viaRepo = viaRepo;
    }
    async getViaById(id) {
        return this.viaRepo.getById(id);
    }
    async getVias() {
        return this.viaRepo.getAll();
    }
    async createVia(viaData) {
        return this.viaRepo.create(viaData);
    }
    async updateVia(id, viaData) {
        await this.viaRepo.update(id, viaData);
    }
    async deleteVia(id) {
        await this.viaRepo.delete(id);
    }
    async getViasIdByColecaoId(colecaoId) {
        return this.viaRepo.getViasIdByColecaoId(colecaoId);
    }
}
exports.ViaService = ViaService;
