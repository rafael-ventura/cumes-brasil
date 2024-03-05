import {Router} from 'express';
import ViaRouter from "./ViaRouter";
import UsuarioRouter from "./UsuarioRouter";
import MontanhaRouter from "./MontanhaRouter";
import FonteRouter from "./FonteRouter";
import FaceRouter from "./FaceRouter";
import CroquiRouter from "./CroquiRouter";
import ColecaoRouter from './ColecaoRouter';
import EscaladaRouter from './EscaladaRouter';
import {ConexaoController} from "../Controllers/ConexaoController";
import {ConexaoService} from "../../Application/services/ConexaoService";
import {authenticateToken} from "../Middlewares/AuthenticateMiddleware";
import AuthenticateRouter from "./AuthenticateRouter";

const routes = Router();
routes.use('', AuthenticateRouter);
routes.use('/vias', ViaRouter);
routes.use('/fontes', FonteRouter);
routes.use('/montanhas', MontanhaRouter);
routes.use('/faces', FaceRouter);
routes.use('/croquis', CroquiRouter);

routes.use(authenticateToken); //Todas as rotas abaixo precisam de autenticação
routes.use('/usuarios', UsuarioRouter);
routes.use('/colecoes', ColecaoRouter);
routes.use('/escaladas', EscaladaRouter);

const internalService = new ConexaoService();
const conexaoController = new ConexaoController(internalService);
routes.get('/conexao', conexaoController.checkDatabaseHealth);
routes.get('/teste', conexaoController.checkDatabaseHealth);

export default routes;