import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import { MulterMiddleware } from "../Middlewares/MulterMiddleware";
import {authenticateToken} from "../Middlewares/AuthenticateMiddleware";

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository());

const usuarioController = new UsuarioController(usuarioService)

const PerfilRouter = Router();

// perfil do Usuario
PerfilRouter.get('/', usuarioController.getPerfil);
PerfilRouter.put('/', authenticateToken, MulterMiddleware.upload, MulterMiddleware.handleErrors, usuarioController.editarDados);

export default PerfilRouter;
