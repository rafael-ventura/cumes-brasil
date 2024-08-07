"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaService = void 0;
class ViaService {
    constructor(viaRepo) {
        this.viaRepo = viaRepo;
    }
    async getViaById(id) {
        const via = await this.viaRepo.getById(id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        return via;
    }
    async getVias(page, limit) {
        if (page !== undefined && limit !== undefined) {
            return this.viaRepo.getAll(page, limit);
        }
        else {
            return this.viaRepo.getAllWithoutPagination();
        }
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
    async getViasIdByColecaoId(colecaoId, page, limit) {
        return this.viaRepo.getViasByColecaoId(colecaoId, page, limit);
    }
    async getViasNotInColecaoId(colecaoId, page, limit) {
        return this.viaRepo.getViasNotInColecaoId(colecaoId, page, limit);
    }
}
exports.ViaService = ViaService;
