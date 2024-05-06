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
MontanhaRouter.post("/", montanhaController.createMontanha);
MontanhaRouter.put("/:id", montanhaController.updateMontanha);
MontanhaRouter.delete("/:id", montanhaController.deleteMontanha);

export default MontanhaRouter;
