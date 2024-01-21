import {CroquiService} from "../../Application/services/CroquiService";
import {Request, Response} from "express";

export class CroquiController {
    private croquiService: CroquiService;

    constructor(croquiService: CroquiService) {
        this.croquiService = croquiService;
    }

    async getCroquiById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const croqui = await this.croquiService.getCroquiById(id);
        if (croqui) {
            res.status(200).json(croqui);
        } else {
            res.status(404).send();
        }
    }

    async getAllCroqui(req: Request, res: Response) {
        const croquis = await this.croquiService.getCroquis();
        if (croquis) {
            res.status(200).json(croquis);
        } else {
            res.status(404).send();
        }
    }

    async createCroqui(req: Request, res: Response) {
        const croqui = req.body;
        await this.croquiService.createCroqui(croqui);
        res.status(201).send();
    }

    async updateCroqui(req: Request, res: Response) {
        const croqui = req.body;
        await this.croquiService.updateCroqui(croqui);
        res.status(200).send();
    }

    async deleteCroqui(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.croquiService.deleteCroqui(id);
        res.status(200).send();
    }
}