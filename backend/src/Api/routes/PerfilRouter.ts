import { Router } from 'express';
import { Container } from 'typedi';
import { UsuarioController } from '../Controllers/UsuarioController';
import { MulterMiddleware } from "../Middlewares/MulterMiddleware";
import {authenticateToken} from "../Middlewares/AuthenticateMiddleware";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const usuarioController = Container.get(UsuarioController);

const PerfilRouter = Router();

// perfil do Usuario
PerfilRouter.get('/', authenticateToken, asyncErrorHandler(usuarioController.getPerfil));
PerfilRouter.put('/', MulterMiddleware.upload, asyncErrorHandler(usuarioController.editarDados));
PerfilRouter.put('/foto', MulterMiddleware.upload, asyncErrorHandler(usuarioController.editarFotoPerfil));
PerfilRouter.delete('/foto', asyncErrorHandler(usuarioController.excluirFotoPerfil));


export default PerfilRouter;
