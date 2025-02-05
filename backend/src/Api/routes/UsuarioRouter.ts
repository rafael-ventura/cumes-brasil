import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { MulterMiddleware } from '../Middlewares/MulterMiddleware';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { authenticateToken } from "../Middlewares/AuthenticateMiddleware";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository(), new ImagemRepository());
const usuarioController = new UsuarioController(usuarioService);
const UsuarioRouter = Router();

UsuarioRouter.get("/", usuarioController.getAll);
UsuarioRouter.get("/:id", usuarioController.getById);
UsuarioRouter.delete("/:id", usuarioController.delete);

// perfil do usuario - Movido para o Perfil - TODO - remover
/*UsuarioRouter.get('/perfil', usuarioController.getPerfil);
UsuarioRouter.put('/perfil', authenticateToken, usuarioController.editarDados);
UsuarioRouter.put('/perfil/foto', authenticateToken, MulterMiddleware.upload, usuarioController.editarFotoPerfil);*/

export default UsuarioRouter;
