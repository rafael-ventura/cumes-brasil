import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { MulterMiddleware } from '../Middlewares/MulterMiddleware';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { authenticateToken } from "../Middlewares/AuthenticateMiddleware";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository());
const usuarioController = new UsuarioController(usuarioService);

const UsuarioRouter = Router();

UsuarioRouter.get("/:id", usuarioController.getById);
UsuarioRouter.get("/", usuarioController.getAll);
UsuarioRouter.post("/", usuarioController.registrar);
UsuarioRouter.put('/', authenticateToken, MulterMiddleware.upload, usuarioController.editarDados);
UsuarioRouter.delete("/:id", usuarioController.delete);

// perfil do usuario
UsuarioRouter.get('/perfil/:id', usuarioController.getPerfil);

UsuarioRouter.post("/generate-reset-password", usuarioController.generateResetUserPasswordToken);
UsuarioRouter.put("/reset-password/:token", usuarioController.resetPassword);

export default UsuarioRouter;
