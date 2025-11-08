import {Request, Response} from "express";
import {ImagemService} from "../../Application/services/ImagemService";
import {Imagem} from "../../Domain/entities/Imagem";
import {ImagemDTO} from "../DTOs/Imagem/ImagemDTO";
import { NotFoundError } from '../../Application/errors';
import ImagemValidation from '../../Application/validations/ImagemValidation';

export class ImagemController {
    private service: ImagemService;

    constructor(imagemService: ImagemService) {
        this.service = imagemService;
    }

    /**
     * @route GET /imagens/:id
     * @group Imagem - Operações relacionadas a Imagem
     * @returns {Imagem.model} 200 - Imagem encontrada
     * @returns {object} 404 - Imagem não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getImagemById = async (req: Request, res: Response) => {
        const id = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getById(id);

        if (!result) {
            throw new NotFoundError("Imagem não encontrada");
        }

        return res.json(new ImagemDTO(result));
    };

    /**
     * @route GET /imagens
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagem não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllImagem = async (_: Request, res: Response) => {
        const result = await this.service.getAll();
        if (!result?.length) {
            throw new NotFoundError("Nenhuma Imagem encontrada");
        }

        return res.json(result.map(img => new ImagemDTO(img)));
    };

    /**
     * @route POST /imagens
     * @group Imagem - Operações relacionadas a imagens
     * @param {Imagem.model} Imagem.body.required - Nova Imagem
     * @returns {void} 201 - Imagem criada
     * @returns {Error} 500 - Erro desconhecido
     */
    createImagem = async (req: Request, res: Response) => {
        const imagem: Imagem = req.body;
        ImagemValidation.createBody(imagem);
        await this.service.create(imagem);
        res.status(201).send();
    };

    /**
     * @route PUT /imagens/:id
     * @group Imagem - Operações relacionadas a imagens
     * @param {Imagem.model} Imagem.body.required - Imagem atualizada
     * @returns {void} 204 - Imagem atualizada
     * @returns {object} 404 - Imagem não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    updateImagem = async (req: Request, res: Response) => {
        const imagem: Imagem = req.body;
        ImagemValidation.updateBody(imagem);
        await this.service.update(imagem.id, imagem);
        res.status(204).send();
    };

    /**
     * @route DELETE /imagens/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {void} 204 - Imagem deletada
     * @returns {object} 404 - Imagem não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    deleteImagem = async (req: Request, res: Response) => {
        const id = ImagemValidation.idParam(req.params.id);
        await this.service.delete(id);
        res.status(204).send();
    };

    /**
     * @route GET /imagens/colecao/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagens não encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getByColecaoId = async (req: Request, res: Response) => {
        const colecaoId = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getByColecaoId(colecaoId);
        if (!result) {
            throw new NotFoundError("Imagens não encontradas");
        }
        res.json(result);
    };

    /**
     * @route GET /imagens/usuario/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagens não encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getByUsuarioId = async (req: Request, res: Response) => {
        const usuarioId = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getByUsuarioId(usuarioId);
        if (!result) {
            throw new NotFoundError("Imagens não encontradas");
        }
        res.json(result);
    };

    /**
     * @route GET /imagens/montanha/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagens não encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getByMontanhaId = async (req: Request, res: Response) => {
        const montanhaId = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getByMontanhaId(montanhaId);
        if (!result) {
            throw new NotFoundError("Imagens não encontradas");
        }
        res.json(result);
    };

    /**
     * @route GET /imagens/via/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagens não encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getByViaId = async (req: Request, res: Response) => {
        const viaId = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getByViaId(viaId);
        if (!result) {
            throw new NotFoundError("Imagens não encontradas");
        }
        res.json(result);
    };

    /**
     * @route GET /imagens/croqui/:id
     * @group Imagem - Operações relacionadas a imagens
     * @returns {Array.<Imagem>} 200 - Imagens encontradas
     * @returns {object} 404 - Imagens não encontradas
     * @returns {Error} 500 - Erro desconhecido
     */
    getByCroquiId = async (req: Request, res: Response) => {
        const croquiId = ImagemValidation.idParam(req.params.id);
        const result = await this.service.getByCroquiId(croquiId);
        if (!result) {
            throw new NotFoundError("Imagens não encontradas");
        }
        res.json(result);
    };

}
