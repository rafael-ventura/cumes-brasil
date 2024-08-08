import { Router } from 'express';
import { ViaController } from '../Controllers/ViaController';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';

const viaRepository = new ViaRepository();
const viaService = new ViaService(viaRepository);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get("/:id", viaController.getViaById);
ViaRouter.get("/", viaController.getAllVia);
ViaRouter.post("/", viaController.createVia);
ViaRouter.put("/:id", viaController.updateVia);
ViaRouter.delete("/:id", viaController.deleteVia);
ViaRouter.get("/colecao/:id", viaController.getViasInColecao);
ViaRouter.get('/colecao/not/:id', viaController.getViasNotInColecao);

export default ViaRouter;
