
import {Request, Response} from "express";
import {FonteService} from "../../Application/services/FonteService";

export class FonteController {
    private fonteService: FonteService;

    constructor(fonteService: FonteService) {
        this.fonteService = fonteService;
    }

    async getFonteById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const fonte = await this.fonteService.getFonteById(id);
        if (fonte) {
            res.status(200).json(fonte);
        } else {
            res.status(404).send();
        }
    }

    async getAllFonte(req: Request, res: Response) {
        const fontes = await this.fonteService.getFontes();
        if (fontes) {
            res.status(200).json(fontes);
        } else {
            res.status(404).send();
        }
    }

    async createFonte(req: Request, res: Response) {
        const fonte = req.body;
        await this.fonteService.createFonte(fonte);
        res.status(201).send();
    }

    async updateFonte(req: Request, res: Response) {
        const fonte = req.body;
        await this.fonteService.updateFonte(fonte);
        res.status(200).send();
    }

    async deleteFonte(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.fonteService.deleteFonte(id);
        res.status(200).send();
    }
}