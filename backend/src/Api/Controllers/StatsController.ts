import { Request, Response } from 'express';
import { StatsService } from '../../Application/services/StatsService';
import { Service } from 'typedi';

@Service()
export class StatsController {
    private service: StatsService;

    constructor(service: StatsService) {
        this.service = service;
    }

    /**
     * @route GET /stats
     * @group Stats - Operações relacionadas a estatísticas
     * @returns {object} 200 - Estatísticas gerais (vias, montanhas, usuarios)
     * @returns {Error} 500 - Erro desconhecido
     */
    getGeneralStats = async (_: Request, res: Response) => {
        const stats = await this.service.getGeneralStats();
        return res.status(200).json(stats);
    };
}

