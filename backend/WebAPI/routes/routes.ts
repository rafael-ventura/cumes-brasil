import { Router } from 'express';
import ViaRouter from "./ViaRouter";
import ConexaoController from "../Controllers/ConexaoController";

const routes = Router();

routes.use('/vias', ViaRouter);
routes.get('/conexao', ConexaoController.testConnection);

export default routes;