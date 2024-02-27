"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaService = void 0;
class MontanhaService {
    constructor(montanhaRepository) {
        this.montanhaRepository = montanhaRepository;
    }
    async getMontanhaById(id) {
        return this.montanhaRepository.getMontanhaById(id);
    }
    async getMontanhas() {
        return this.montanhaRepository.getMontanhas();
    }
    async createMontanha(montanha) {
        return this.montanhaRepository.createMontanha(montanha);
    }
    async updateMontanha(montanha) {
        if (!await this.getMontanhaById(montanha.id)) {
            throw new Error("Montanha não encontrada");
        }
        return this.montanhaRepository.updateMontanha(montanha);
    }
    async deleteMontanha(id) {
        if (!await this.getMontanhaById(id)) {
            throw new Error("Montanha não encontrada");
        }
        return this.montanhaRepository.deleteMontanha(id);
    }
}
exports.MontanhaService = MontanhaService;
