import { CroquiService } from "../../Application/services/CroquiService";
import { Request, Response } from "express";
import { Croqui } from "../../Domain/models/Croqui";
import { ViaService } from "../../Application/services/ViaService";

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
    getAllCroqui = async (req: Request, res: Response) => {
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
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getAllCroqui" });
            }
        }
    };

    /**
     * @route POST /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 201 - Croqui criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createCroqui = async (req: Request, res: Response) => {
        try {
            const croqui = req.body;
            await this.service.createCroqui(croqui);
            res.status(201).json({ message: "Croqui criada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller createCroqui" });
            }
        }
    };

    /**
     * @route PUT /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateCroqui = async (req: Request, res: Response) => {
        try {
            const croqui: Croqui = req.body;
            await this.service.updateCroqui(croqui);
            res.status(200).json({ message: "Croqui atualizada com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Croqui não encontrada") {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(500).json({ error: error.message });
                }
            } else {
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller updateCroqui" });
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
    deleteCroqui = async (req: Request, res: Response) => {
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
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller deleteCroqui" });
            }
        }
    };


    // funão não usada
    getCroquisByViaId = async (req: Request, res: Response) => {
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
                res.status(500).json({ error: "Ocorreu um erro desconhecido em controller getCroquisByViaId" });
            }
        }
    };

    /**
     * @route POST /croquis/associarVia
     * @group Croquis - Operações relacionadas a croquis e vias
     * @returns {via_id, croqui_id} 201 - Croqui associado a Via com sucesso
     * @param {via_id, croqui_id} - passado no corpo da requisicao
     * @returns {object} 404 - Croqui ou Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    associarCroquiEmVia = async (req: Request, res: Response) => {
    try {
        const { via_id, croqui_id } = req.body; //Obtendo dados do corpo da requisição
        const viaId: number = (via_id);
        const croquiId: number = (croqui_id);
        await this.service.associarCroquiEmVia(croquiId, viaId);
        res.status(201).json({ message: 'Croqui associado a Via com sucesso' });
    } catch (error) {
        if (error instanceof Error) {
            let statusCode = 500;
            let errorMessage = 'Ocorreu um erro desconhecido em controller associarVia';
            switch (error.message) {
                case 'Erro na passagem de Ids. Id inválido':
                case 'Croqui não encontrado':
                case 'Via não encontrada':
                    statusCode = 404;
                    errorMessage = error.message;
                    break;
            }
            res.status(statusCode).json({ error: errorMessage });
        } else {
            res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller associarVia' });
        }
    }
};


    /**
     * @route DELETE /croquis/desassociarVia/:viaId/:croquiId
     * @group Croquis - Operações relacionadas a croquis e vias
     * @returns {via_id, croqui_id} 201 - Croqui desassociado a Via com sucesso
     * @param {via_id, croqui_id} - passado como parametro http
     * @returns {object} 404 - Croqui ou Via não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    desassociarCroquiEmVia = async (req: Request, res: Response) => {
        try {
            const { via_id, croqui_id } = req.body;
            const viaId: number = parseInt(via_id);
            const croquiId: number = parseInt(croqui_id);
            await this.service.desassociarCroquiEmVia(croquiId, viaId);
            res.status(200).json({ message: 'Croqui desassociado a Via com sucesso' })

        } catch (error) {
            if (error instanceof Error) {
                let statusCode = 500;
                let errorMessage = 'Ocorreu um erro desconhecido em controller associarVia';
                switch (error.message) {
                    case 'Erro na passagem de Ids. Id inválido':
                    case 'Croqui associado não encontrado para esta via':
                        statusCode = 404;
                        errorMessage = error.message;
                        break;
                }
                res.status(statusCode).json({ error: errorMessage });
            } else {
                res.status(500).json({ error: 'Ocorreu um erro desconhecido em controller associarVia' });
            }
        }
    }


}
