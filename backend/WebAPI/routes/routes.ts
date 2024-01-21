import { Router } from 'express';
import ViaRouter from "./ViaRouter";
import {ConexaoController} from "../Controllers/ConexaoController";
import {ConexaoService} from "../../Application/services/ConexaoService";
import dbConnection from "../../Infrastructure/config/db";

const routes = Router();

const internalService = new ConexaoService();
const conexaoController = new ConexaoController(internalService);

routes.use('/vias', ViaRouter);
routes.get('/conexao', conexaoController.checkDatabaseHealth);
routes.get('/teste', conexaoController.checkDatabaseHealth);

export default routes;