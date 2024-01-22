import {Request, Response} from "express";
import {FaceService} from "../../Application/services/FaceService";

export class FaceController {
    private service: FaceService;

    constructor(faceService: FaceService) {
        this.service = faceService;
    }

    async getFaceById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.getFaceById(id);
            if (!result) {
                return res.status(404).json({message: "Face não encontrada."});
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

    async getAllFace(req: Request, res: Response) {
        try {
            const faces = await this.service.getFaces();
            if (!faces) {
                return res.status(404).json({message: "Face não encontrada."});
            }
            res.json(faces);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({error: error.message});
            } else {
                res.status(500).json({error: "Ocorreu um erro desconhecido"});
            }
        }
    }

    async createFace(req: Request, res: Response) {
        const face = req.body;
        await this.service.createFace(face);
        res.status(201).send();
    }

    async updateFace(req: Request, res: Response) {
        const face = req.body;
        await this.service.updateFace(face);
        res.status(200).send();
    }

    async deleteFace(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.deleteFace(id);
        res.status(200).send();
    }
}
