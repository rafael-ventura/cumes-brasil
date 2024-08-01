import { Router } from "express";
import { MontanhaController } from "../Controllers/MontanhaController";
import { MontanhaService } from "../../Application/services/MontanhaService";
import { MontanhaRepository } from "../../Infrastructure/repositories/MontanhaRepository";

const montanhaRepository = new MontanhaRepository();
const montanhaService = new MontanhaService(montanhaRepository);
const montanhaController = new MontanhaController(montanhaService);

const MontanhaRouter = Router();

MontanhaRouter.get("/:id", montanhaController.getMontanhaById);
MontanhaRouter.get("/", montanhaController.getAllMontanha);

export default MontanhaRouter;
