import {MontanhaService} from "../../Application/services/MontanhaService";
import {Request, Response} from "express";
import {Montanha} from "../../Domain/models/Montanha";

export class MontanhaController {
    private service: MontanhaService;

    constructor(montanhaService: MontanhaService) {
        this.service = montanhaService;
    }

    async getMontanhaById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getMontanhaById(id);
            if (!result) {
                return res.status(404).json({message: "Montanha não encontrada."});
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

    async getAllMontanha(req: Request, res: Response) {
        try {
            const result = await this.service.getMontanhas();
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    async createMontanha(req: Request, res: Response) {
        try {
            const montanha: Montanha = req.body;
            await this.service.createMontanha(montanha);
            res.status(201).json({message: "Montanha criada com sucesso."});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    async updateMontanha(req: Request, res: Response) {
        const montanha: Montanha = req.body;
        await this.service.updateMontanha(montanha);
        res.status(200).send();
    }

    async deleteMontanha(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.deleteMontanha(id);
        res.status(200).send();
    }
}