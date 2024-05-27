"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../Controllers/UsuarioController");
const UsuarioService_1 = require("../../Application/services/UsuarioService");
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const AuthorizationMiddleware_1 = require("../Middlewares/AuthorizationMiddleware");
const usuarioService = new UsuarioService_1.UsuarioService(new UsuarioRepository_1.UsuarioRepository());
const usuarioController = new UsuarioController_1.UsuarioController(usuarioService);
const PerfilRouter = (0, express_1.Router)();
// perfil do Usuario
PerfilRouter.get('/', AuthorizationMiddleware_1.authorizationMiddleware, usuarioController.getPerfil);
exports.default = PerfilRouter;
