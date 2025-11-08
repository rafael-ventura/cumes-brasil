import {Router} from "express";

import {CroquiService} from "../../Application/services/CroquiService";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";
import {CroquiController} from "../Controllers/CroquiController";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {ViaCroquiRepository} from "../../Infrastructure/repositories/ViaCroquiRepository";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const viaRepository = new ViaRepository();
const croquiRepository = new CroquiRepository();
const viaCroquiRepository = new ViaCroquiRepository();
const croquiService = new CroquiService(croquiRepository, viaRepository, viaCroquiRepository);
const croquiController = new CroquiController(croquiService);

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
