"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConexaoController = void 0;
class ConexaoController {
    constructor(internalService) {
        /**
         * @route GET /conexao
         * @group Conexão - Operações relacionadas a conexão
         * @returns {object} 200 - Conexão com sucesso
         * @returns {Error} 500 - Database not responding
         */
        this.checkDatabaseHealth = async (_, res) => {
            const isHealthy = await this.internalService.healthCheck();
            if (isHealthy) {
                res.status(200).json({ status: "API está conectada ao banco de dados e responde corretamente" });
            }
            else {
                res.status(500).json({ status: "error", message: "Database not responding" });
            }
        };
        this.internalService = internalService;
    }
}
exports.ConexaoController = ConexaoController;
