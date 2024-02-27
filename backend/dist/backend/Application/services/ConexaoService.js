"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConexaoService = void 0;
const db_1 = __importDefault(require("../../Infrastructure/config/db"));
class ConexaoService {
    constructor() {
        this.db = db_1.default;
    }
    async healthCheck() {
        try {
            const db = await this.db;
            return new Promise((resolve) => {
                db.get("SELECT 1", (err) => {
                    resolve(!err);
                });
            });
        }
        catch (error) {
            console.error('Erro ao realizar health check:', error);
            return false;
        }
    }
}
exports.ConexaoService = ConexaoService;
