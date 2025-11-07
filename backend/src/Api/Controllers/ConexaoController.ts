import {Request, Response} from 'express';
import {ConexaoService} from "../../Application/services/ConexaoService";
import InternalServerError from '../../Application/errors/InternalServerError';

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
            res.status(200).json({ status: "API está conectada ao banco de dados e responde corretamente" });
        } else {
            throw new InternalServerError("Database not responding");
        }
    };
}
