import { Router } from 'express';
import { ViaController } from '../Controllers/ViaController';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const viaRepository = new ViaRepository();
const viaService = new ViaService(viaRepository);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get("/random", asyncErrorHandler(viaController.getRandomVia));
ViaRouter.get("/:id", asyncErrorHandler(viaController.getViaById));
ViaRouter.get("/", asyncErrorHandler(viaController.getAllVia));
ViaRouter.post("/", asyncErrorHandler(viaController.createVia));
ViaRouter.put("/:id", asyncErrorHandler(viaController.updateVia));
ViaRouter.delete("/:id", asyncErrorHandler(viaController.deleteVia));
ViaRouter.get("/colecao/:id", asyncErrorHandler(viaController.getViasInColecao));
ViaRouter.get('/colecao/not/:id', asyncErrorHandler(viaController.getViasNotInColecao));
ViaRouter.get('/count/:filter', asyncErrorHandler(viaController.countEntities));
export default ViaRouter;
