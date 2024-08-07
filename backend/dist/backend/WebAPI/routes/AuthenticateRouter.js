"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthenticateController_1 = __importDefault(require("../Controllers/AuthenticateController"));
const UsuarioController_1 = require("../Controllers/UsuarioController");
const UsuarioService_1 = require("../../Application/services/UsuarioService");
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const ErrorRequestMiddleware_1 = require("../Middlewares/ErrorRequestMiddleware");
const AuthenticateRouter = (0, express_1.Router)();
const authController = new AuthenticateController_1.default();
const usuarioService = new UsuarioService_1.UsuarioService(new UsuarioRepository_1.UsuarioRepository());
const usuarioController = new UsuarioController_1.UsuarioController(usuarioService);
// Rota de login
AuthenticateRouter.post("/login", authController.login);
AuthenticateRouter.post("/google-login", authController.googleLogin);
// Rota de registro
AuthenticateRouter.post("/register", usuarioController.registrar);
AuthenticateRouter.use(ErrorRequestMiddleware_1.errorRequestMiddleware);
exports.default = AuthenticateRouter;
