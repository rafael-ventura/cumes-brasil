"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoService = void 0;
class ColecaoService {
    constructor(colecaoRepo) {
        this.colecaoRepo = colecaoRepo;
    }
    async getColecaoById(id) {
        return this.colecaoRepo.getById(id);
    }
    async getAllColecoes() {
        return this.colecaoRepo.getAll();
    }
    async getColecoesByUsuarioId(usuarioId) {
        return this.colecaoRepo.getByUsuarioId(usuarioId);
    }
    async createColecao(colecaoData) {
        await this.colecaoRepo.create(colecaoData);
    }
    async updateColecao(id, colecaoData) {
        await this.colecaoRepo.update(id, colecaoData);
    }
    async deleteColecao(id) {
        await this.colecaoRepo.delete(id);
    }
    async addViaToColecao(viaId, colecaoId) {
        await this.colecaoRepo.addViaToColecao(viaId, colecaoId);
    }
    async removeViaFromColecao(viaId, colecaoId) {
        await this.colecaoRepo.removeViaFromColecao(viaId, colecaoId);
    }
}
exports.ColecaoService = ColecaoService;
