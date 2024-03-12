import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {UsuarioController} from '../Controllers/UsuarioController';
import {UsuarioService} from '../../Application/services/UsuarioService';
import {UsuarioRepository} from '../../Infrastructure/repositories/UsuarioRepository';
import {authorizationMiddleware} from "../Middlewares/AuthorizationMiddleware";

const usuarioService = new UsuarioService(new UsuarioRepository(dbConnection));
const usuarioController = new UsuarioController(usuarioService)

const PerfilRouter = Router();

// perfil do usuario
PerfilRouter.get('/', authorizationMiddleware, usuarioController.getPerfil);


export default PerfilRouter;
