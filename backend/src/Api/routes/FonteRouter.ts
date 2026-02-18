import { Router } from "express";
import { Container } from 'typedi';
import { FonteController } from "../Controllers/FonteController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const fonteController = Container.get(FonteController);

const FonteRouter = Router();

FonteRouter.get("/:id", asyncErrorHandler(fonteController.getFonteById));
FonteRouter.get("/", asyncErrorHandler(fonteController.getAllFonte));
FonteRouter.post("/", asyncErrorHandler(fonteController.createFonte));
FonteRouter.put("/:id", asyncErrorHandler(fonteController.updateFonte));
FonteRouter.delete('/:id', asyncErrorHandler(fonteController.deleteFonte));

export default FonteRouter;
