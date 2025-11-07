import {CroquiService} from "../../Application/services/CroquiService";
import {Request, Response} from "express";
import {Croqui} from "../../Domain/entities/Croqui";
import {CroquiDTO} from "../DTOs/Croqui/CroquiDTO";
import { NotFoundError } from '../../Application/errors';
import CroquiValidation from '../../Application/validations/CroquiValidation';

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
        const id = CroquiValidation.idParam(req.params.id);
        const croqui = await this.service.getCroquiById(id);

        if (!croqui) {
            throw new NotFoundError("Croqui não encontrada");
        }

        return res.json(new CroquiDTO(croqui));
    };

    /**
     * @route GET /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {Array.<Croqui>} 200 - Croquis encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAll = async (_: Request, res: Response) => {
        const croquis = await this.service.getCroquis();
        return res.json(croquis.map(c => new CroquiDTO(c)));
    }

    /**
     * @route POST /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 201 - Croqui criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    create = async (req: Request, res: Response) => {
        const croqui = req.body;
        CroquiValidation.createBody(croqui);
        await this.service.createCroqui(croqui);
        res.status(201).json({message: "Croqui criada com sucesso"});
    };

    /**
     * @route PUT /croquis
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    update = async (req: Request, res: Response) => {
        const croqui: Croqui = req.body;
        CroquiValidation.updateBody(croqui);
        await this.service.updateCroqui(croqui.id, croqui);
        res.status(200).json({message: "Croqui atualizada com sucesso"});
    };

    /**
     * @route DELETE /croquis/:id
     * @group Croquis - Operações relacionadas a croquis
     * @returns {object} 200 - Croqui deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Croqui não encontrada
     */
    delete = async (req: Request, res: Response) => {
        const id = CroquiValidation.idParam(req.params.id);
        await this.service.deleteCroqui(id);
        res.status(200).json({message: "Croqui deletada com sucesso"});
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
        const viaId: number = CroquiValidation.viaIdQuery(req.query.via_id);
        const croquiId: number = CroquiValidation.croquiIdQuery(req.query.croqui_id);
        await this.service.associarCroquiEmVia(croquiId, viaId);
        res.status(201).json({message: "Croqui associado a Via com sucesso"});
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
        const viaId: number = CroquiValidation.viaIdQuery(req.query.via_id);
        const croquiId: number = CroquiValidation.croquiIdQuery(req.query.croqui_id);
        await this.service.desassociarCroquiEmVia(croquiId, viaId);
        res.status(201).json({message: "Croqui desassociado a Via com sucesso"});

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
        const id = CroquiValidation.idParam(req.params.id);

        const croquis = await this.service.getCroquisByViaId(id);
        res.status(200).json(croquis);
    };

}
