import { Router } from 'express';
import { Container } from 'typedi';
import { ViaController } from '../Controllers/ViaController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const viaController = Container.get(ViaController);

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
