import { Router } from 'express';
import { Container } from 'typedi';
import { EscaladaController } from '../Controllers/EscaladaController';
import { authenticateToken } from '../Middlewares/AuthenticateMiddleware';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const escaladaController = Container.get(EscaladaController);

const EscaladaRouter = Router();

EscaladaRouter.get(
  "/",
  asyncErrorHandler(escaladaController.getAllEscalada)
);
EscaladaRouter.get(
  "/usuario",
  authenticateToken,
  asyncErrorHandler(escaladaController.getByUsuarioId)
);

EscaladaRouter.post(
  "/",
  authenticateToken,
  asyncErrorHandler(escaladaController.createEscalada)
);
EscaladaRouter.put(
  "/:id",
  authenticateToken,
  asyncErrorHandler(escaladaController.updateEscalada)
);
EscaladaRouter.delete(
  "/:id",
  authenticateToken,
  asyncErrorHandler(escaladaController.deleteEscalada)
);

export default EscaladaRouter;
