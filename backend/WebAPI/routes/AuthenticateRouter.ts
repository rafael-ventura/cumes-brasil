// routes/auth.routes.ts

import { Router } from 'express';
import AuthController from "../Controllers/AuthenticateController";
import {UsuarioController} from "../Controllers/UsuarioController";
import {UsuarioService} from "../../Application/services/UsuarioService";
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import dbConnection from "../../Infrastructure/config/db";

const AuthenticateRouter = Router();
const authController = new AuthController();
const usuarioService = new UsuarioService(new UsuarioRepository(dbConnection));
const usuarioController = new UsuarioController(usuarioService);

// Rota de login
AuthenticateRouter.post('/login', authController.login);
AuthenticateRouter.post('/google-login', authController.googleLogin);

// Rota de registro
AuthenticateRouter.post('/register', usuarioController.createUsuario);

export default AuthenticateRouter;
