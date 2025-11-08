import { Router } from "express";
import { FonteController } from "../Controllers/FonteController";
import { FonteService } from "../../Application/services/FonteService";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const fonteService = new FonteService(new FonteRepository());
const fonteController = new FonteController(fonteService);

const FonteRouter = Router();

FonteRouter.get("/:id", asyncErrorHandler(fonteController.getFonteById));
FonteRouter.get("/", asyncErrorHandler(fonteController.getAllFonte));
FonteRouter.post("/", asyncErrorHandler(fonteController.createFonte));
FonteRouter.put("/:id", asyncErrorHandler(fonteController.updateFonte));
FonteRouter.delete('/:id', asyncErrorHandler(fonteController.deleteFonte));

export default FonteRouter;
