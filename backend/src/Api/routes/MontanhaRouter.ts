import { Router } from "express";
import { MontanhaController } from "../Controllers/MontanhaController";
import { MontanhaService } from "../../Application/services/MontanhaService";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const montanhaRepository = new MontanhaRepository();
const montanhaService = new MontanhaService(montanhaRepository);
const montanhaController = new MontanhaController(montanhaService);

const MontanhaRouter = Router();

MontanhaRouter.get("/:id", asyncErrorHandler(montanhaController.getMontanhaById));
MontanhaRouter.get("/", asyncErrorHandler(montanhaController.getAllMontanha));

export default MontanhaRouter;
