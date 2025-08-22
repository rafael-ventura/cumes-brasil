import {MontanhaService} from "../../Application/services/MontanhaService";
import {Request, Response} from "express";
import {MontanhaDTO} from "../DTOs/Montanha/MontanhaDTO";

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
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getMontanhaById(id);
            if (!result) {
                return res.status(404).json({ message: "Montanha não encontrada." });
            }
            return res.json(new MontanhaDTO(result));
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
        }
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
        try {
            const montanhas = await this.service.getMontanhas();
            if (!montanhas || montanhas.length === 0) {
                return res.status(404).json({ message: "Nenhuma montanha encontrada" });
            }
            return res.json(montanhas.map(m => new MontanhaDTO(m)));
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Erro desconhecido" });
        }
    };
}
