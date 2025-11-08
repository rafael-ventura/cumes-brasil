import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import { MulterMiddleware } from "../Middlewares/MulterMiddleware";
import {authenticateToken} from "../Middlewares/AuthenticateMiddleware";
import UsuarioRouter from "./UsuarioRouter";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository(), new ImagemRepository());

const usuarioController = new UsuarioController(usuarioService)

const PerfilRouter = Router();

// perfil do Usuario
PerfilRouter.get('/', authenticateToken, asyncErrorHandler(usuarioController.getPerfil));
PerfilRouter.put('/', MulterMiddleware.upload, asyncErrorHandler(usuarioController.editarDados));
PerfilRouter.put('/foto', MulterMiddleware.upload, asyncErrorHandler(usuarioController.editarFotoPerfil));
PerfilRouter.delete('/foto', asyncErrorHandler(usuarioController.excluirFotoPerfil));


export default PerfilRouter;
