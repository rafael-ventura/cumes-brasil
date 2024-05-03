"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonteService = void 0;
class FonteService {
    constructor(fonteRepository) {
        this.fonteRepository = fonteRepository;
    }
    async getFonteById(id) {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        return this.fonteRepository.getById(id);
    }
    async getFontes() {
        return this.fonteRepository.getAll();
    }
    async createFonte(fonte) {
        if (!fonte) {
            throw new Error("Fonte inválida");
        }
        return this.fonteRepository.create(fonte);
    }
    async updateFonte(id, fonteData) {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        const existingFonte = await this.getFonteById(id);
        if (!existingFonte) {
            throw new Error("Fonte não encontrada");
        }
        await this.fonteRepository.update(id, fonteData);
    }
    async deleteFonte(id) {
        if (!id) {
            throw new Error("ID da fonte não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da fonte inválido");
        }
        const existingFonte = await this.getFonteById(id);
        if (!existingFonte) {
            throw new Error("Fonte não encontrada");
        }
        await this.fonteRepository.delete(id);
    }
}
exports.FonteService = FonteService;
