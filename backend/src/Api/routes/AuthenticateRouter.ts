import { Router } from 'express';
import { Container } from 'typedi';
import AuthController from '../Controllers/AuthenticateController';
import { UsuarioController } from '../Controllers/UsuarioController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

// Obter controllers do Container de DI (TypeDI)
const AuthenticateRouter = Router();
const authController = Container.get(AuthController);
const usuarioController = Container.get(UsuarioController);

// Rota de login
AuthenticateRouter.post("/login", asyncErrorHandler(authController.login));
AuthenticateRouter.post("/google-login", asyncErrorHandler(authController.googleLogin));

// Rota de registro
AuthenticateRouter.post("/register", asyncErrorHandler(authController.registrar));

AuthenticateRouter.post("/generate-reset-password", asyncErrorHandler(authController.generateResetUserPasswordToken));

AuthenticateRouter.put("/reset-password/:token", asyncErrorHandler(authController.resetPassword));

// Tratamento de erros será feito globalmente no server

export default AuthenticateRouter;
