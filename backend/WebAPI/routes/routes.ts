import { Router } from 'express';
import ViaRouter from "./ViaRouter";
import UsuarioRouter from "./UsuarioRouter";
import MontanhaRouter from "./MontanhaRouter";
import FonteRouter from "./FonteRouter";
import FaceRouter from "./FaceRouter";
import CroquiRouter from "./CroquiRouter";
import {ConexaoController} from "../Controllers/ConexaoController";
import {ConexaoService} from "../../Application/services/ConexaoService";

const routes = Router();

const internalService = new ConexaoService();
const conexaoController = new ConexaoController(internalService);

routes.use('/vias', ViaRouter);
routes.use('/montanhas', MontanhaRouter);
routes.use('/usuarios', UsuarioRouter);
routes.use('/fontes', FonteRouter);
routes.use('/faces', FaceRouter);
routes.use('/croquis', CroquiRouter);
routes.get('/conexao', conexaoController.checkDatabaseHealth);
routes.get('/teste', conexaoController.checkDatabaseHealth);

export default routes;