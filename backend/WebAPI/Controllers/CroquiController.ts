import {CroquiService} from "../../Application/services/CroquiService";
import {Request, Response} from "express";

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
        const id = Number(req.params.id);
        const croqui = await this.service.getCroquiById(id);
        if (croqui) {
            res.status(200).json(croqui);
        } else {
            res.status(404).send();
        }
    }

    /**
     * @route GET /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {Array.<Croqui>} 200 - Croquis encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllCroqui = async (req: Request, res: Response) => {
        const croquis = await this.service.getCroquis();
        if (croquis) {
            res.status(200).json(croquis);
        } else {
            res.status(404).send();
        }
    }

    /**
     * @route POST /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 201 - Croqui criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createCroqui = async (req: Request, res: Response) => {
        const croqui = req.body;
        await this.service.createCroqui(croqui);
        res.status(201).send();
    }

    /**
     * @route PUT /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateCroqui = async (req: Request, res: Response) => {
        const croqui = req.body;
        await this.service.updateCroqui(croqui);
        res.status(200).send();
    }

    /**
     * @route DELETE /croquis/:id
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     */
    deleteCroqui = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.service.deleteCroqui(id);
        res.status(200).send();
    }
}