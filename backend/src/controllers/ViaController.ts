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
import { IVia, Via } from '../models/IVia';
import store from '../config/db';
import {ViaRepository} from "../repositories/ViaRepository"; // Importe sua configuração do RavenDB

const repo = new ViaRepository(store);

export const createRoute = async (req: Request, res: Response) => {
    const route: IVia = req.body;
    const result = await repo.create(route);
    res.json(result);
};

export const getViaById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await repo.getById(id);
    res.json(result);
};

export const getAllVia = async (_: Request, res: Response) => {
    const result = await repo.getAll();
    res.json(result);
};

export const updateVia = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedRoute: IVia = req.body;
    const result = await repo.update(id, updatedRoute);
    res.json(result);
};

export const deleteVia = async (req: Request, res: Response) => {
    const id = req.params.id;
    await repo.delete(id);
    res.sendStatus(204);
};

