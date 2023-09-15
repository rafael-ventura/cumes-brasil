import ViaRepository from '../repositories/ViaRepository';
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

export default new ViaController();
