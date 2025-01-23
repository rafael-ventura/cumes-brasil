import { Router } from 'express';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { EscaladaService } from '../../Application/services/EscaladaService';
import { EscaladaController } from '../Controllers/EscaladaController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { authenticateToken } from '../Middlewares/AuthenticateMiddleware';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';

const viaRepository = new ViaRepository();
const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository(), new ImagemRepository());
const escaladaRepository = new EscaladaRepository();
const viaService = new ViaService(viaRepository);
const escaladaService = new EscaladaService(escaladaRepository, usuarioService, viaService);
const escaladaController = new EscaladaController(escaladaService);

const EscaladaRouter = Router();

EscaladaRouter.get("/", escaladaController.getAllEscalada);
EscaladaRouter.get("/usuario", authenticateToken, escaladaController.getByUsuarioId);

EscaladaRouter.post("/", authenticateToken, escaladaController.createEscalada);
EscaladaRouter.put("/:id", authenticateToken, escaladaController.updateEscalada);
EscaladaRouter.delete("/:id", authenticateToken, escaladaController.deleteEscalada);

export default EscaladaRouter;
