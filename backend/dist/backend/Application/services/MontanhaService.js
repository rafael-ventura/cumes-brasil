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
}
exports.MontanhaService = MontanhaService;
