import {MontanhaService} from "../../Application/services/MontanhaService";
import {Request, Response} from "express";
import {MontanhaDTO} from "../DTOs/Montanha/MontanhaDTO";
import { NotFoundError } from '../../Application/errors';
import MontanhaValidation from '../../Application/validations/MontanhaValidation';
import { Service } from 'typedi';

@Service()
export class MontanhaController {
    private service: MontanhaService;

    constructor(montanhaService: MontanhaService) {
        this.service = montanhaService;
    }

    /**
     * @route GET /montanhas/:id
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {Montanha.model} 200 - montanha encontrada
     * @returns {object} 404 - montanha não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getMontanhaById = async (req: Request, res: Response) => {
        const id = MontanhaValidation.idParam(req.params.id);
        const result = await this.service.getMontanhaById(id);
        if (!result) {
            throw new NotFoundError("Montanha não encontrada.");
        }
        return res.json(new MontanhaDTO(result));
    };

    /**
     * @route GET /montanhas
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {Array.<Montanha>} 200 - Montanhas encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - montanha não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllMontanha = async (_: Request, res: Response) => {
        const montanhas = await this.service.getMontanhas();
        if (!montanhas || montanhas.length === 0) {
            throw new NotFoundError("Nenhuma montanha encontrada");
        }
        return res.json(montanhas.map(m => new MontanhaDTO(m)));
    };
}
