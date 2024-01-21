
import {Request, Response} from "express";
import {FaceService} from "../../Application/services/FaceService";

export class FaceController {
    private faceService: FaceService;

    constructor(faceService: FaceService) {
        this.faceService = faceService;
    }

    async getFaceById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const face = await this.faceService.getFaceById(id);
        if (face) {
            res.status(200).json(face);
        } else {
            res.status(404).send();
        }
    }

    async getAllFace(req: Request, res: Response) {
        const faces = await this.faceService.getFaces();
        if (faces) {
            res.status(200).json(faces);
        } else {
            res.status(404).send();
        }
    }

    async createFace(req: Request, res: Response) {
        const face = req.body;
        await this.faceService.createFace(face);
        res.status(201).send();
    }

    async updateFace(req: Request, res: Response) {
        const face = req.body;
        await this.faceService.updateFace(face);
        res.status(200).send();
    }

    async deleteFace(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.faceService.deleteFace(id);
        res.status(200).send();
    }
}
