import { Router } from 'express';
import ViaRouter from './ViaRouter';
import UsuarioRouter from './UsuarioRouter';
import MontanhaRouter from './MontanhaRouter';
import FonteRouter from './FonteRouter';
import FaceRouter from './FaceRouter';
import CroquiRouter from './CroquiRouter';
import ColecaoRouter from './ColecaoRouter';
import EscaladaRouter from './EscaladaRouter';
import { ConexaoController } from '../Controllers/ConexaoController';
import { ConexaoService } from '../../Application/services/ConexaoService';
import { AppDataSource } from '../../Infrastructure/config/db';
import AuthenticateRouter from './AuthenticateRouter';
import { authenticateToken, optionalAuthenticateToken } from '../Middlewares/AuthenticateMiddleware';
import ImagemRouter from './ImagemRouter';
import SearchRouter from './SearchRouter';
import PerfilRouter from "./PerfilRouter";
import { authRateLimiter, uploadRateLimiter, createContentRateLimiter } from '../Middlewares/RateLimitMiddleware';

const routes = Router();
const conexaoController = new ConexaoController(new ConexaoService(AppDataSource));

// Rota de health check (sem rate limiting)
routes.get("/conexao", conexaoController.checkDatabaseHealth);

// Rotas de autenticação com rate limiting específico
routes.use("/auth", authRateLimiter, AuthenticateRouter);

// Rotas públicas
routes.use("/vias", ViaRouter);
routes.use("/fontes", FonteRouter);
routes.use("/montanhas", MontanhaRouter);
routes.use("/faces", FaceRouter);
routes.use("/croquis", CroquiRouter);

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
