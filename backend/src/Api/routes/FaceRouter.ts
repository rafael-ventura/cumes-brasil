import { Router } from "express";
import { FaceController } from "../Controllers/FaceController";
import { FaceService } from "../../Application/services/FaceService";
import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { FonteService } from "../../Application/services/FonteService";
import { MontanhaService } from "../../Application/services/MontanhaService";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const faceRepository = new FaceRepository();
const montanhaRepository = new MontanhaRepository();
const montanhaService = new MontanhaService(montanhaRepository);
const fonteRepository = new FonteRepository();
const fonteService = new FonteService(fonteRepository);

const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const faceController = new FaceController(faceService);

const FaceRouter = Router();

FaceRouter.get("/:id", asyncErrorHandler(faceController.getFaceById));
FaceRouter.get("/", asyncErrorHandler(faceController.getAllFace));
FaceRouter.post("/", asyncErrorHandler(faceController.createFace));
FaceRouter.put("/:id", asyncErrorHandler(faceController.updateFace));
FaceRouter.delete("/:id", asyncErrorHandler(faceController.deleteFace));

export default FaceRouter;
