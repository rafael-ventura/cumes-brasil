import {ViaDto} from "../../../shared/contratos/ViaDto";
import {ViaService} from "../../Application/services/ViaService";
import {Request, Response} from "express";

/**
 * @class ViaController
 * Controller para operações relacionadas a vias.
 */
export class ViaController {
    private service: ViaService;

    /**
     * Construtor para o controller de vias.
     * @param {ViaService} service - O serviço de vias que será utilizado pelo controller.
     */
    constructor(service: ViaService) {
        this.service = service;
    }

    /**
     * Obtém uma via pelo ID.
     * @param {Request} req - O request do express, contendo o ID da via como parâmetro.
     * @param {Response} res - O response do express, onde a via será retornada.
     */
    getViaById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.service.getViaById(id);
        res.json(result);
    };

    /**
     * Obtém todas as vias.
     * @param {Request} _ - O request do express.
     * @param {Response} res - O response do express, onde as vias serão retornadas.
     */
    getAllVia = async (_: Request, res: Response) => {
        const result = await this.service.getAll();
        res.json(result);
    };

    /**
     * Cria uma nova via.
     * @param {Request} req - O request do express, contendo os dados da nova via no corpo da requisição.
     * @param {Response} res - O response do express, onde a via criada será retornada.
     */
    createVia = async (req: Request, res: Response) => {
        const via: ViaDto = req.body;
        const result = await this.service.createVia(via);
        res.json(result);
    };

    /**
     * Atualiza uma via existente.
     * @param {Request} req - O request do express, contendo os dados atualizados da via no corpo da requisição.
     * @param {Response} res - O response do express, onde a via atualizada será retornada.
     */
    updateVia = async (req: Request, res: Response) => {
        const via: ViaDto = req.body;
        const result = await this.service.updateVia(via);
        res.json(result);
    };

    /**
     * Deleta uma via pelo ID.
     * @param {Request} req - O request do express, contendo o ID da via como parâmetro.
     * @param {Response} res - O response do express, que retornará uma mensagem de sucesso.
     */
    deleteVia = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.service.deleteVia(parseInt(id));
        res.json({message: 'Via deletada com sucesso'});
    };

    /**
     * Obtém todas as montanhas.
     * @param {Request} _ - O request do express.
     * @param {Response} res - O response do express, onde as montanhas serão retornadas.
     */
    getMontanha = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.service.getMontanhaById(id);

        res.json(result);

    };

    /**
     * Obtém todas as faces.
     * @param {Request} _ - O request do express.
     * @param {Response} res - O response do express, onde as faces serão retornadas.
     */
    getFace = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.service.getFaceById(id);

        res.json(result);
    }
    /**
     * Obtém todas as fontes.
     * @param {Request} _ - O request do express.
     * @param {Response} res - O response do express, onde as fontes serão retornadas.
     */
    getFonte = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.service.getFonteById(id);

        res.json(result);
    }
}
