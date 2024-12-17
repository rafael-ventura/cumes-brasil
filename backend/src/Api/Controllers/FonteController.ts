import { Request, Response } from "express";
import { FonteService } from "../../Application/services/FonteService";
import { Fonte } from "../../Domain/entities/Fonte";

export class FonteController {
    private service: FonteService;

    constructor(fonteService: FonteService) {
        this.service = fonteService;
    }

    /**
     * @route Fontes /fontes/:id
     * @group Fonte - Operações relacionadas a Fonte
     * @returns {Fonte.model} 200 - Fonte encontrada
     * @returns {object} 404 - Fonte não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getFonteById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getFonteById(id);
            if (!result) {
                return res.status(404).json({ error: "Fonte não encontrada" });
            }
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getFonteById" });
            }
        }
    }

    /**
     * @route GET /fontes
     * @group Fonte - Operações relacionadas a fontes
     * @returns {Array.<Fonte>} 200 - Fonte encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Fonte não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllFonte = async (_: Request, res: Response) => {
        try {
            const result: Fonte[] | null = await this.service.getFontes();
            if (result?.length === 0) {
                return res.status(404).json({ error: "Nenhuma Fonte encontrada" });
            }
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllFonte" });
            }
        }
    }

    /**
     * @route POST /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 201 - Fonte criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createFonte = async (req: Request, res: Response) => {
        try {
            const fonte: Fonte = req.body;
            await this.service.createFonte(fonte);
            res.status(201).json({ message: "Fonte criada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller createFonte" });
            }
        }
    }

    /**
     * @route PUT /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateFonte = async (req: Request, res: Response) => {
        try {
            const fonte: Fonte = req.body;
            await this.service.updateFonte(fonte.id, fonte);
            res.status(200).json({ message: "Fonte atualizada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Fonte não encontrada") {
                    return res.status(404).json({ error: error.message });
                }
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateFonte" });
            }
        }
    }

    /**
     * @route DELETE /fontes/:id
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Fonte não encontrada
     */
    deleteFonte = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteFonte(id);
            res.status(200).json({ message: "Fonte deletada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Fonte não encontrada") {
                    return res.status(404).json({ error: error.message });
                } else if (error.message === "Erro ao deletar Fonte") {
                    return res.status(500).json({ error: error.message });
                }
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller deleteFonte" });
            }
        }
    }
}
