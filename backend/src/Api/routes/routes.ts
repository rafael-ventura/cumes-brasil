import { Router } from 'express';
import ViaRouter from './ViaRouter';
import UsuarioRouter from './UsuarioRouter';
import MontanhaRouter from './MontanhaRouter';
import FonteRouter from './FonteRouter';
import FaceRouter from './FaceRouter';
import CroquiRouter from './CroquiRouter';
import ColecaoRouter from './ColecaoRouter';
import EscaladaRouter from './EscaladaRouter';
import StatsRouter from './StatsRouter';
import LocalizacaoRouter from './LocalizacaoRouter';
import { ConexaoController } from '../Controllers/ConexaoController';
import { ConexaoService } from '../../Application/services/ConexaoService';
import { AppDataSource } from '../../Infrastructure/config/db';
import AuthenticateRouter from './AuthenticateRouter';
import { authenticateToken, optionalAuthenticateToken } from '../Middlewares/AuthenticateMiddleware';
import ImagemRouter from './ImagemRouter';
import SearchRouter from './SearchRouter';
import PerfilRouter from "./PerfilRouter";
import { authRateLimiter, uploadRateLimiter, createContentRateLimiter } from '../Middlewares/RateLimitMiddleware';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';

// TODO: GARANTIR QUE OS MIDDLEWARES ESTAO SENDO APLICADOS NA ORDEM CORRETA.
// TODO: VERIFICAR SE ROTAS SEGUEM PADRAO REST.
// TODO: VERIFIQUE A NECESSIDADE DE CRIAR METODOS E ISOLAR TRECHOS DE CODIGO COMUM.

const routes = Router();
const conexaoController = new ConexaoController(new ConexaoService(AppDataSource));

// Rota de health check (sem rate limiting)
routes.get("/conexao", asyncErrorHandler(conexaoController.checkDatabaseHealth));

// Rotas de autenticação com rate limiting específico
routes.use("/auth", authRateLimiter, AuthenticateRouter);

// Rotas públicas
routes.use("/stats", StatsRouter);

// Perfil público por username (sem auth)
const perfilPublicoUsuarioService = new UsuarioService(
    new UsuarioRepository(),
    new ImagemService(new ImagemRepository()),
    new ViaRepository(),
    new ImagemRepository(),
    new EscaladaRepository(),
    new ColecaoRepository()
);
const perfilPublicoController = new UsuarioController(perfilPublicoUsuarioService);
routes.get("/u/:username", asyncErrorHandler(perfilPublicoController.getPerfilPorUsername));

routes.use("/vias", ViaRouter);
routes.use("/fontes", FonteRouter);
routes.use("/montanhas", MontanhaRouter);
routes.use("/faces", FaceRouter);
routes.use("/croquis", CroquiRouter);
routes.use("/localizacoes", LocalizacaoRouter);

// Rotas de upload com rate limiting específico
routes.use("/imagens", uploadRateLimiter, ImagemRouter);

// Rotas autenticadas com rate limiting para criação de conteúdo
routes.use("/usuarios", authenticateToken, UsuarioRouter);
routes.use("/escaladas", authenticateToken, createContentRateLimiter, EscaladaRouter);
routes.use('/colecoes', authenticateToken, createContentRateLimiter, ColecaoRouter);
routes.use("/perfil", authenticateToken, PerfilRouter);

// Rota de busca com autenticação opcional
routes.use("/search", optionalAuthenticateToken, SearchRouter);

export default routes;
