"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaService = void 0;
class MontanhaService {
    constructor(montanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }
    async getMontanhaById(id) {
        return this.montanhaRepository.getById(id);
    }
    async getMontanhas() {
        return this.montanhaRepository.getAll();
    }
    async createMontanha(montanha) {
        return this.montanhaRepository.create(montanha);
    }
    async updateMontanha(id, montanhaData) {
        await this.montanhaRepository.update(id, montanhaData);
    }
    async deleteMontanha(id) {
        await this.montanhaRepository.delete(id);
    }
}
exports.MontanhaService = MontanhaService;
