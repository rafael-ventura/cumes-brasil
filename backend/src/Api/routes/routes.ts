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
import BuscaRouter from './BuscaRouter';
import PerfilRouter from "./PerfilRouter";
import { authRateLimiter, uploadRateLimiter, createContentRateLimiter } from '../Middlewares/RateLimitMiddleware';
import { MulterMiddleware } from '../Middlewares/MulterMiddleware';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import SeguimentoRouter from './SeguimentoRouter';
import ConquistasRouter from './ConquistasRouter';
import AdminRouter from './AdminRouter';
import { ViaImageSugestaoController } from '../Controllers/Admin/ViaImageSugestaoController';
import { requireAdmin } from '../Middlewares/AdminMiddleware';

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
routes.use("/busca", optionalAuthenticateToken, BuscaRouter);
// Compat: mantém /search apontando para o mesmo router
routes.use("/search", optionalAuthenticateToken, BuscaRouter);

// Rede social (seguir / seguidores)
routes.use("/seguimentos", SeguimentoRouter);

// Conquistas (badges por tier)
routes.use("/conquistas", ConquistasRouter);

// Painel de administração (autenticação obrigatória + requireAdmin)
routes.use("/admin", authenticateToken, requireAdmin, AdminRouter);

// Sugestão de imagem de via por usuário autenticado
const sugestaoCtrl = new ViaImageSugestaoController();
routes.post("/vias/:viaId/imagens/sugerir", authenticateToken, uploadRateLimiter, MulterMiddleware.uploadViaImagem, asyncErrorHandler(sugestaoCtrl.submeter));
routes.get("/vias/:viaId/imagens/aprovadas", asyncErrorHandler(sugestaoCtrl.listarAprovadaPorVia));

export default routes;
