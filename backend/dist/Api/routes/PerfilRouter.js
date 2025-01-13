"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../Controllers/UsuarioController");
const UsuarioService_1 = require("../../Application/services/UsuarioService");
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const ImagemRepository_1 = require("../../Infrastructure/repositories/ImagemRepository");
const ImagemService_1 = require("../../Application/services/ImagemService");
const ViaRepository_1 = require("../../Infrastructure/repositories/ViaRepository");
const MulterMiddleware_1 = require("../Middlewares/MulterMiddleware");
const AuthenticateMiddleware_1 = require("../Middlewares/AuthenticateMiddleware");
const usuarioService = new UsuarioService_1.UsuarioService(new UsuarioRepository_1.UsuarioRepository(), new ImagemService_1.ImagemService(new ImagemRepository_1.ImagemRepository()), new ViaRepository_1.ViaRepository());
const usuarioController = new UsuarioController_1.UsuarioController(usuarioService);
const PerfilRouter = (0, express_1.Router)();
// perfil do Usuario
PerfilRouter.get('/', usuarioController.getPerfil);
PerfilRouter.put('/', AuthenticateMiddleware_1.authenticateToken, MulterMiddleware_1.MulterMiddleware.upload, MulterMiddleware_1.MulterMiddleware.handleErrors, usuarioController.editarDados);
exports.default = PerfilRouter;
