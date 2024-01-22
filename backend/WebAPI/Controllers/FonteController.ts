import {Request, Response} from "express";
import {FonteService} from "../../Application/services/FonteService";
import {Fonte} from "../../Domain/models/Fonte";

export class FonteController {
    private service: FonteService;

    constructor(fonteService: FonteService) {
        this.service = fonteService;
    }

    async getFonteById(req: Request, res: Response) {
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
    }

    async getAllFonte(req: Request, res: Response) {
        try {
            const result = await this.service.getFontes();
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
            res.status(500).json({error: error.message});
            } else {
            res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    async createFonte(req: Request, res: Response) {
        try {
            const fonte : Fonte = req.body;
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

    async updateFonte(req: Request, res: Response) {
        const fonte = req.body;
        await this.service.updateFonte(fonte);
        res.status(200).send();
    }

    async deleteFonte(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.deleteFonte(id);
        res.status(200).send();
    }
}