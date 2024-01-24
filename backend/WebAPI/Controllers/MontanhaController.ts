import {MontanhaService} from "../../Application/services/MontanhaService";
import {Request, Response} from "express";
import {Montanha} from "../../Domain/models/Montanha";

export class MontanhaController {
    private service: MontanhaService;

    constructor(montanhaService: MontanhaService) {
        this.service = montanhaService;
    }

    /**
     * @route GET /montanhas/:id
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {Montanha.model} 200 - Montanha encontrada
     * @returns {object} 404 - Montanha não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getMontanhaById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getMontanhaById(id);
            if (!result) {
                return res.status(404).json({message: "Montanha não encontrada."});
            }
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    /**
     * @route GET /montanhas
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {Array.<Montanha>} 200 - Montanhas encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Montanha não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllMontanha = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getMontanhas();
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    /**
     * @route POST /montanhas
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {object} 201 - Montanha criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createMontanha = async (req: Request, res: Response) => {
        try {
            const montanha: Montanha = req.body;
            await this.service.createMontanha(montanha);
            res.status(201).json({message: "Montanha criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    /**
     * @route PUT /montanhas
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {object} 200 - Montanha atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateMontanha = async (req: Request, res: Response) => {
        const montanha: Montanha = req.body;
        await this.service.updateMontanha(montanha);
        res.status(200).send();
    }

    /**
     * @route DELETE /montanhas/:id
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {object} 200 - Montanha deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Montanha não encontrada
     */
    deleteMontanha = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.service.deleteMontanha(id);
        res.status(200).send();
    }
}