import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import upload from '../Middlewares/MulterMiddleware';
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository());

const usuarioController = new UsuarioController(usuarioService)

const PerfilRouter = Router();

// perfil do Usuario
PerfilRouter.get('/', usuarioController.getPerfil);
PerfilRouter.put('/', upload.single('foto_perfil'), usuarioController.editarDados);


export default PerfilRouter;
