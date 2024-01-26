import { ColecaoService } from "../../Application/services/ColecaoService";
import { ColecaoBase } from "../../Domain/models/ColecaoBase";
import {Request, Response} from "express";

export class ColecaoController {
    private service: ColecaoService;

    constructor(colecaoaService: ColecaoService) {
        this.service = colecaoaService;
    }

    /**
     * @route GET /Colecaoes/:id
     * @group Colecaoes - Operações relacionadas a Colecaoes
     * @returns {Colecao.model} 200 - Colecao encontrada
     * @returns {object} 404 - Colecao não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getColecaoById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getColecaoBaseById(id);
            if (!result) {
                return res.status(404).json({message: "Colecao não encontrada."});
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
     * @route GET /Colecaos
     * @group Colecaos - Operações relacionadas a Colecaos
     * @returns {Array.<Colecao>} 200 - Colecaos encontradas
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getAllColecao = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getColecoesBase();
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
     * @route POST /Colecaos
     * @group Colecoes - Operações relacionadas a Colecoes
     * @returns {object} 201 - Colecao criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createColecao = async (req: Request, res: Response) => {
        try {
            const colecao: ColecaoBase = req.body;
            await this.service.createColecaoBase(colecao);
            res.status(201).json({message: "Colecao criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    /**
     * @route PUT /Colecoes
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateColecao = async (req: Request, res: Response) => {
        const colecao: ColecaoBase = req.body;
        await this.service.updateColecaoBase(colecao);
        res.status(200).send();
    }

    /**
     * @route DELETE /Colecoes/:id
     * @group Colecoes - Operações relacionadas a colecoes
     * @returns {object} 200 - Colecao deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Colecao não encontrada
     */
    deleteColecao = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.service.deleteColecaoBase(id);
        res.status(200).send();
    }
}