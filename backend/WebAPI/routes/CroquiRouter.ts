import { Router } from "express";

import { CroquiService } from "../../Application/services/CroquiService";
import { CroquiRepository } from "../../Infrastructure/repositories/CroquiRepository";
import { CroquiController } from "../Controllers/CroquiController";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";

const viaRepository = new ViaRepository();
const croquiRepository = new CroquiRepository();
const croquiService = new CroquiService(croquiRepository, viaRepository);
const croquiController = new CroquiController(croquiService);

const CroquiRouter = Router();

CroquiRouter.get("/:id", croquiController.getCroquiById);
CroquiRouter.get("/", croquiController.getAll);
CroquiRouter.get("/via/:id", croquiController.getByViaId);
CroquiRouter.post("/", croquiController.create);
CroquiRouter.put("/:id", croquiController.update);
CroquiRouter.delete("/:id", croquiController.delete);
CroquiRouter.post("/via/associar", croquiController.associarVia);
CroquiRouter.post("/via/desassociar", croquiController.desassociarVia);

export default CroquiRouter;
