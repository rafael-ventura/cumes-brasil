import { Router } from 'express';
import AuthController from '../Controllers/AuthenticateController';
import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { errorRequestMiddleware } from '../Middlewares/ErrorRequestMiddleware';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';

const AuthenticateRouter = Router();
const authController = new AuthController();
const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()));

const usuarioController = new UsuarioController(usuarioService);

// Rota de login
AuthenticateRouter.post("/login", authController.login);
AuthenticateRouter.post("/google-login", authController.googleLogin);

// Rota de registro
AuthenticateRouter.post("/register", usuarioController.registrar);

AuthenticateRouter.use(errorRequestMiddleware);

export default AuthenticateRouter;
