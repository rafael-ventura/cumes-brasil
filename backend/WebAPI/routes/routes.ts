import { Router } from 'express';
import ViaRouter from "./ViaRouter";
import UserRoute from "./UserRoute";
import ConexaoController from "../Controllers/ConexaoController";

const routes = Router();

routes.use('/vias', ViaRouter);
routes.get('/conexao', ConexaoController.testConnection);
routes.get('/teste', ConexaoController.testConnection);
routes.use('/user', UserRoute);

export default routes;