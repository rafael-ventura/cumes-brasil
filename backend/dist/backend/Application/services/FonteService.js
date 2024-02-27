"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonteService = void 0;
class FonteService {
    constructor(fonteRepository) {
        this.fonteRepository = fonteRepository;
    }
    async getFonteById(id) {
        return this.fonteRepository.getFonteById(id);
    }
    async getFontes() {
        return this.fonteRepository.getFontes();
    }
    async createFonte(fonte) {
        return this.fonteRepository.createFonte(fonte);
    }
    async updateFonte(fonte) {
        if (!await this.getFonteById(fonte.id)) {
            throw new Error("Fonte não encontrada");
        }
    }
    async deleteFonte(id) {
        if (!await this.getFonteById(id)) {
            throw new Error("Fonte não encontrada");
        }
    }
}
exports.FonteService = FonteService;
