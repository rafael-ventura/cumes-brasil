import { CroquiService } from "../../Application/services/CroquiService";
import { Request, Response } from "express";
import { Croqui } from "../../Domain/entities/Croqui";

export class CroquiController {
    private service: CroquiService;

    constructor(croquiService: CroquiService) {
        this.service = croquiService;
    }

    /**
     * @route GET /croquis/:id
     * @group Croquis - Operações relacionadas a croquis
     * @returns {Croqui.model} 200 - Croqui encontrada
     * @returns {object} 404 - Croqui não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getCroquiById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getCroquiById(id);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Croqui não encontrada") {
                    res.status(404).json({ error: error.message });
                }
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getCroquiById" });
            }
        }
    };

    /**
     * @route GET /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {Array.<Croqui>} 200 - Croquis encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const croquis: Croqui[] | null = await this.service.getCroquis();
            if (croquis?.length === 0) {
                return res.status(404).json({ message: "Nenhuma croqui encontrada" });
            }
            res.json(croquis);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAll" });
            }
        }
    };

    /**
     * @route POST /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 201 - Croqui criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    create = async (req: Request, res: Response) => {
        try {
            const croqui = req.body;
            await this.service.createCroqui(croqui);
            res.status(201).json({ message: "Croqui criada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller create" });
            }
        }
    };

    /**
     * @route PUT /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    update = async (req: Request, res: Response) => {
        try {
            const croqui: Croqui = req.body;
            await this.service.updateCroqui(croqui.id, croqui);
            res.status(200).json({ message: "Croqui atualizada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Croqui não encontrada") {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(500).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller update" });
            }
        }
    };

    /**
     * @route DELETE /croquis/:id
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     */
    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteCroqui(id);
            res.status(200).json({ message: "Croqui deletada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Croqui não encontrada") {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(500).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller delete" });
            }
        }
    };

    /**
     * @route POST /croquis/associarVia
     * @group Croquis - Operações relacionadas a croquis e vias
     * @returns {via_id, croqui_id} 201 - Croqui associado a Via com sucesso
     * @returns {object} 404 - Croqui ou Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     * @param req
     * @param res
     */

    associarVia = async (req: Request, res: Response) => {
        try {
            const viaId: number = parseInt(req.query.via_id as string);
            const croquiId: number = parseInt(req.query.croqui_id as string);
            await this.service.associarCroquiEmVia(croquiId, viaId);
            res.status(201).json({ message: "Croqui associado a Via com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller delete" });
            }
        }
    };

    /**
     * @route DELETE /croquis/desassociarVia/:viaId/:croquiId
     * @group Croquis - Operações relacionadas a croquis e vias
     * @returns {via_id, croqui_id} 201 - Croqui desassociado a Via com sucesso
     * @returns {object} 404 - Croqui ou Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     * @param req
     * @param res
     */
    desassociarVia = async (req: Request, res: Response) => {
        try {
            const viaId: number = parseInt(req.query.via_id as string);
            const croquiId: number = parseInt(req.query.croqui_id as string);
            await this.service.desassociarCroquiEmVia(croquiId, viaId);
            res.status(201).json({ message: "Croqui desassociado a Via com sucesso" });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller delete" });
            }
        }
    }

    /**
     * @route GET /croquis/via/:id
     * @group Croquis - Operações relacionadas a croquis e vias
     * @returns {Array.<Croqui>} 200 - Croquis encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getByViaId = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            const croquis = await this.service.getCroquisByViaId(id);
            res.status(200).json(croquis);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller delete" });
            }
        }
    };

}
