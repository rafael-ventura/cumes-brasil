/*import ViaRepository from '../repositories/ViaRepository';
import { Request, Response } from 'express';


class ViaController {
    async listAll(req: Request, res: Response) {
        const vias = await ViaRepository.findAll();
        res.json(vias);
    }

    async findById(req: Request , res: Response) {
        const { id } = req.params;
        const via = await ViaRepository.findById(Number(id));
        res.json(via);
    }

    async findDetailedById(req: Request, res: Response) {
        const { id } = req.params;
        const via = await ViaRepository.findDetailedById(Number(id));
        res.json(via);
    }
}

export default new ViaController();*/

import { Request, Response } from 'express';
import store from '../config/db';
import { ViaRepository } from '../repositories/ViaRepository';

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

    //TODO: validar necessidade
    /*createVia = async (req: Request, res: Response) => {
        const route: IVia = req.body;
        const result = await this.repo.create(route);
        res.json(result);
    };

    updateVia = async (req: Request, res: Response) => {
        const id = req.params.id;
        const updatedRoute: IVia = req.body;
        const result = await this.repo.update(id, updatedRoute);
        res.json(result);
    };

    deleteVia = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.repo.delete(id);
        res.sendStatus(204);
    };*/
}

export default new ViaController();

