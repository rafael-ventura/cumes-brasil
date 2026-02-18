import { Router } from 'express';
import { Container } from 'typedi';
import { UsuarioController } from '../Controllers/UsuarioController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const usuarioController = Container.get(UsuarioController);
const UsuarioRouter = Router();

UsuarioRouter.get("/", asyncErrorHandler(usuarioController.getAll));
UsuarioRouter.get("/:id", asyncErrorHandler(usuarioController.getById));
UsuarioRouter.delete("/:id", asyncErrorHandler(usuarioController.delete));

export default UsuarioRouter;
