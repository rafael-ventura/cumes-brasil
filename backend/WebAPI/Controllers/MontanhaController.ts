import {MontanhaService} from "../../Application/services/MontanhaService";
import {Request, Response} from "express";
import {Montanha} from "../../Domain/models/Montanha";

export class MontanhaController {
    private montanhaService: MontanhaService;

    constructor(montanhaService: MontanhaService) {
        this.montanhaService = montanhaService;
    }

    async getMontanhaById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const montanha = await this.montanhaService.getMontanhaById(id);
        if (montanha) {
            res.status(200).json(montanha);
        } else {
            res.status(404).send();
        }
    }

    async getAllMontanha(req: Request, res: Response) {
        const montanhas = await this.montanhaService.getMontanhas();
        if (montanhas) {
            res.status(200).json(montanhas);
        } else {
            res.status(404).send();
        }
    }

    async createMontanha(req: Request, res: Response) {
        const montanha : Montanha = req.body;
        await this.montanhaService.createMontanha(montanha);
        res.status(201).send();
    }

    async updateMontanha(req: Request, res: Response) {
        const montanha: Montanha = req.body;
        await this.montanhaService.updateMontanha(montanha);
        res.status(200).send();
    }

    async deleteMontanha(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.montanhaService.deleteMontanha(id);
        res.status(200).send();
    }
}