import { Request, Response } from 'express';
import store from '../config/db';
import { ViaRepository } from '../repositories/ViaRepository';
import {IVia} from "../models/IVia";

class ViaController {
    private repo: ViaRepository;
    private store: any;

    constructor() {
        this.repo = new ViaRepository(store);
    }

    addVia = async (req: Request, res: Response) => {
        try {
            const novaVia: IVia = req.body; // Certifique-se de que seu corpo de requisição contém os dados corretos da Via
            await this.repo.addVia(novaVia);
            res.status(201).json({ message: 'Via adicionada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar Via', details: error });
        }
    };


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

