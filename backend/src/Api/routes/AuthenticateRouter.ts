import { Router } from 'express';
import AuthController from '../Controllers/AuthenticateController';
import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import UsuarioRouter from "./UsuarioRouter";

const AuthenticateRouter = Router();
const authController = new AuthController();
const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()), new ViaRepository(), new ImagemRepository());

const usuarioController = new UsuarioController(usuarioService);

// Rota de login
AuthenticateRouter.post("/login", asyncErrorHandler(authController.login));
AuthenticateRouter.post("/google-login", asyncErrorHandler(authController.googleLogin));

// Rota de registro
AuthenticateRouter.post("/register", asyncErrorHandler(authController.registrar));

AuthenticateRouter.post("/generate-reset-password", asyncErrorHandler(authController.generateResetUserPasswordToken));

AuthenticateRouter.put("/reset-password/:token", asyncErrorHandler(authController.resetPassword));

// Tratamento de erros será feito globalmente no server

export default AuthenticateRouter;
