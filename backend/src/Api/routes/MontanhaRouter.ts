import { Router } from "express";
import { Container } from 'typedi';
import { MontanhaController } from "../Controllers/MontanhaController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const montanhaController = Container.get(MontanhaController);

const MontanhaRouter = Router();

MontanhaRouter.get("/:id", asyncErrorHandler(montanhaController.getMontanhaById));
MontanhaRouter.get("/", asyncErrorHandler(montanhaController.getAllMontanha));

export default MontanhaRouter;
