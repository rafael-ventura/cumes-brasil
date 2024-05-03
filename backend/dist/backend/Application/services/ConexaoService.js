"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConexaoService = void 0;
class ConexaoService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async healthCheck() {
        return this.dataSource.isInitialized;
    }
}
exports.ConexaoService = ConexaoService;
