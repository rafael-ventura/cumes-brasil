import { Router } from "express";
import { FaceController } from "../Controllers/FaceController";
import { FaceService } from "../../Application/services/FaceService";
import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { FonteService } from "../../Application/services/FonteService";
import { MontanhaService } from "../../Application/services/MontanhaService";

const faceRepository = new FaceRepository();
const montanhaRepository = new MontanhaRepository();
const montanhaService = new MontanhaService(montanhaRepository);
const fonteRepository = new FonteRepository();
const fonteService = new FonteService(fonteRepository);

const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const faceController = new FaceController(faceService);

const FaceRouter = Router();

FaceRouter.get("/:id", faceController.getFaceById);
FaceRouter.get("/", faceController.getAllFace);
FaceRouter.post("/", faceController.createFace);
FaceRouter.put("/:id", faceController.updateFace);
FaceRouter.delete("/:id", faceController.deleteFace);

export default FaceRouter;
