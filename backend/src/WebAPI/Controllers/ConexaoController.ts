import {Request, Response} from 'express';
import {ConexaoService} from "../../Application/services/ConexaoService";

export class ConexaoController {

    private internalService: ConexaoService;

    constructor(internalService: ConexaoService) {
        this.internalService = internalService;
    }

    /**
     * @route GET /conexao
     * @group Conexão - Operações relacionadas a conexão
     * @returns {object} 200 - Conexão com sucesso
     * @returns {Error} 500 - Database not responding
     */
    checkDatabaseHealth = async (_: Request, res: Response) => {
        const isHealthy = await this.internalService.healthCheck();
        if (isHealthy) {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "error", message: "Database not responding" });
        }
    };
}
