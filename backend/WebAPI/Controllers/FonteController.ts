import {Request, Response} from "express";
import {FonteService} from "../../Application/services/FonteService";
import { Fonte } from "../../Domain/models/Fonte";

export class FonteController {
    private service: FonteService;

    constructor(fonteService: FonteService) {
        this.service = fonteService;
    }

    /**
     * @route Fontes /fonte/:id
     * @group Fonte - Operações relacionadas a fonte
     * @returns {Fonte.model} 200 - Fonte encontrada
     * @returns {object} 404 - Fonte não encontrada
     * @returns {Error} 500 - Erro desconhecido
     */
    getFonteById = async(req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const result = await this.service.getFonteById(id);
        if (!result) {
          return res.status(404).json({message: "Fonte não encontrada."});
        }
        res.json(result);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({error: error.message});
        } else {
          res.status(500).json({error: "Ocorreu um erro desconhecido"});
        }
      }
        const id = parseInt(req.params.id);
        const result = await this.service.getFonteById(id);
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
            const result : Fonte[] | null = await this.service.getFontes();
            if (result?.length === 0) {
              return res.status(404).json({message: "Fonte não encontrada"});
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
     * @route POST /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 201 - Fonte criada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    createFonte = async(req: Request, res: Response) => {
        try {
            const fonte: Fonte = req.body;
            await this.service.createFonte(fonte);
            res.status(201).json({message: "Fonte criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
            res.status(500).json({error: error.message});
            } else {
            res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    /**
     * @route PUT /fontes
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte atualizada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     */
    updateFonte = async(req: Request, res: Response) => {
        const fonte = req.body;
        await this.service.updateFonte(fonte);
        res.status(200).send();
    }

    /**
     * @route DELETE /fontes/:id
     * @group Fontes - Operações relacionadas a fontes
     * @returns {object} 200 - Fonte deletada com sucesso
     * @returns {Error} 500 - Erro desconhecido
     * @returns {object} 404 - Fonte não encontrada
     */
    deleteFonte = async(req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.service.deleteFonte(id);
        res.status(200).send();
    }
}