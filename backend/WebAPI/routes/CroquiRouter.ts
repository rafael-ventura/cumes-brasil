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
CroquiRouter.get("/", croquiController.getAllCroqui);
CroquiRouter.get("/:id/croquis", croquiController.getCroquisByViaId);
CroquiRouter.post("/", croquiController.createCroqui);
CroquiRouter.put("/:id", croquiController.updateCroqui);
CroquiRouter.delete("/:id", croquiController.deleteCroqui);
CroquiRouter.post("/associarVia", croquiController.associarCroquiEmVia);
CroquiRouter.post("/desassociarVia", croquiController.desassociarCroquiEmVia);

export default CroquiRouter;
