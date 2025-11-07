import {Request, Response} from "express";
import {FonteService} from "../../Application/services/FonteService";
import {Fonte} from "../../Domain/entities/Fonte";
import {FonteDTO} from "../DTOs/Fonte/FonteDTO";
import { NotFoundError } from '../../Application/errors';
import FonteValidation from '../../Application/validations/FonteValidation';

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
        const id = FonteValidation.idParam(req.params.id);
        const result = await this.service.getFonteById(id);

        if (!result) {
            throw new NotFoundError("Fonte não encontrada");
        }

        return res.json(new FonteDTO(result));
    };

    /**
     * @route GET /fontes
     * @group Fonte - Operações relacionadas a fontes
     * @returns {Array.<Fonte>} 200 - Fonte encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Fonte não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllFonte = async (_: Request, res: Response) => {
        const result = await this.service.getFontes();
        if (!result || result.length === 0) {
            throw new NotFoundError("Nenhuma Fonte encontrada");
        }

        return res.json(result.map(f => new FonteDTO(f)));
    };

    /**
     * @route POST /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 201 - Fonte criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createFonte = async (req: Request, res: Response) => {
        const fonte: Fonte = req.body;
        FonteValidation.createBody(fonte);
        await this.service.createFonte(fonte);
        res.status(201).json({message: "Fonte criada com sucesso"});
    }

    /**
     * @route PUT /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateFonte = async (req: Request, res: Response) => {
        const fonte: Fonte = req.body;
        FonteValidation.updateBody(fonte);
        await this.service.updateFonte(fonte.id, fonte);
        res.status(200).json({message: "Fonte atualizada com sucesso"});
    }

    /**
     * @route DELETE /fontes/:id
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Fonte não encontrada
     */
    deleteFonte = async (req: Request, res: Response) => {
        const id = FonteValidation.idParam(req.params.id);
        await this.service.deleteFonte(id);
        res.status(200).json({message: "Fonte deletada com sucesso"});
    }
}
