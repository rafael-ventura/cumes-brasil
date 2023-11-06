import {ViaService} from "../../Application/services/ViaService";
import {Request, Response} from 'express';

export class ViaController {
    private service: ViaService;

    constructor(service: ViaService) {
        this.service = service;
    }

    getViaById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.service.getViaById(id);
        res.json(result);
    };

    getAllVia = async (_: Request, res: Response) => {
        const result = await this.service.getAllVias();
        res.json(result);
    };

    findDetailedById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const via = await this.service.findDetailedById(id);
        res.json(via);
    }
}
