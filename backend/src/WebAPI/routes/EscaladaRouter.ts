import { Router } from "express";
import { EscaladaRepository } from "../../Infrastructure/repositories/EscaladaRepository";
import { EscaladaService } from "../../Application/services/EscaladaService";
import { EscaladaController } from "../Controllers/EscaladaController";
import { UsuarioService } from "../../Application/services/UsuarioService";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";
import { ViaService } from "../../Application/services/ViaService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";

const viaRepository = new ViaRepository();
const usuarioService = new UsuarioService(new UsuarioRepository());
const escaladaRepository = new EscaladaRepository();
const viaService = new ViaService(viaRepository);
const escaladaService = new EscaladaService(escaladaRepository, usuarioService, viaService);
const escaladaController = new EscaladaController(escaladaService);

const EscaladaRouter = Router();

EscaladaRouter.get("/:id", escaladaController.getEscaladaById);
EscaladaRouter.get("/", escaladaController.getAllEscalada);
EscaladaRouter.post("/", escaladaController.createEscalada);
EscaladaRouter.put("/:id", escaladaController.updateEscalada);
EscaladaRouter.delete("/:id", escaladaController.deleteEscalada);
EscaladaRouter.get("/usuario/:id", escaladaController.getByUsuarioId);
EscaladaRouter.get("/via/:id", escaladaController.getByViaId);

export default EscaladaRouter;
