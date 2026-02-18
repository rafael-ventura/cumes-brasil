import {Router} from "express";
import { Container } from 'typedi';
import {CroquiController} from "../Controllers/CroquiController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const croquiController = Container.get(CroquiController);

const CroquiRouter = Router();

CroquiRouter.get("/:id", asyncErrorHandler(croquiController.getCroquiById));
CroquiRouter.get("/", asyncErrorHandler(croquiController.getAll));
CroquiRouter.get("/via/:id", asyncErrorHandler(croquiController.getByViaId));
CroquiRouter.post("/", asyncErrorHandler(croquiController.create));
CroquiRouter.put("/:id", asyncErrorHandler(croquiController.update));
CroquiRouter.delete("/:id", asyncErrorHandler(croquiController.delete));
CroquiRouter.post("/via/associar", asyncErrorHandler(croquiController.associarVia));
CroquiRouter.post("/via/desassociar", asyncErrorHandler(croquiController.desassociarVia));

export default CroquiRouter;
