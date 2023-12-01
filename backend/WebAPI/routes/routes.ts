import { Router } from 'express';
import ViaRouter from "./ViaRouter";
import ConexaoController from "../Controllers/ConexaoController";
import UserRouter from "./UsuarioRouter";

const routes = Router();

routes.use('/vias', ViaRouter);
routes.get('/conexao', ConexaoController.testConnection);
routes.get('/teste', ConexaoController.testConnection);
routes.use('/user', UserRouter);

export default routes;