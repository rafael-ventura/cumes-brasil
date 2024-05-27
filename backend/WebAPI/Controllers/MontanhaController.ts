import { MontanhaService } from "../../Application/services/MontanhaService";
import { Request, Response } from "express";
import { Montanha } from "../../Domain/entities/Montanha";

export class MontanhaController {
    private service: MontanhaService;

    constructor (montanhaService: MontanhaService) {
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
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller getMontanhaById"});
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
            const montanhas = await this.service.getMontanhas();
            if (montanhas?.length === 0) {
                return res.status(404).json({message: "Nenhuma Montanha encontrada"});
            }
            res.json(montanhas);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller getAllMontanha"});
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
                if (error.message === "Fonte não encontrada") {
                    return res.status(400).json({error: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller createMontanha"});
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
        try {
            const montanha: Montanha = req.body;
            await this.service.updateMontanha(montanha.id, montanha);
            res.json({ message: "Montanha atualizada com sucesso." });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Montanha não encontrada") {
                    return res.status(400).json({error: error.message});
                }else if (error.message === "Fonte não encontrada") {
                    return res.status(400).json({error: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller updateMontanha"});
            }
        }
    }

    /**
     * @route DELETE /montanhas/:id
     * @group Montanhas - Operações relacionadas a montanhas
     * @returns {object} 200 - Montanha deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Montanha não encontrada
     */
    deleteMontanha = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteMontanha(id);
            res.status(200).json({message: "Montanha deletada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Montanha não encontrada") {
                    return res.status(400).json({error: error.message});
                }
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido em controller deleteMontanha"});
            }
        }
    }
}
