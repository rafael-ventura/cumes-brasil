import { Request, Response } from 'express';
import store from '../../Infrastructure/config/db';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';

class ViaController {
    private repo: ViaRepository;

    constructor() {
        this.repo = new ViaRepository(store);
    }

    getViaById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.repo.getById(id);
        res.json(result);
    };

    getAllVia = async (_: Request, res: Response) => {
        const result = await this.repo.getAll();
        res.json(result);
    };


    findDetailedById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const via = await this.repo.findDetailedById(id);
        res.json(via);
    }
}

export default new ViaController();

