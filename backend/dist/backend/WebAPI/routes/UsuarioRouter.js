"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../Infrastructure/config/db"));
const UsuarioController_1 = require("../Controllers/UsuarioController");
const UsuarioService_1 = require("../../Application/services/UsuarioService");
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const usuarioService = new UsuarioService_1.UsuarioService(new UsuarioRepository_1.UsuarioRepository(db_1.default));
const usuarioController = new UsuarioController_1.UsuarioController(usuarioService);
const UsuarioRouter = (0, express_1.Router)();
UsuarioRouter.get('/:id', usuarioController.getUsuarioById);
UsuarioRouter.get('/', usuarioController.getAllUsuario);
UsuarioRouter.post('/', usuarioController.createUsuario);
UsuarioRouter.put('/:id', usuarioController.updateUsuario);
UsuarioRouter.delete('/:id', usuarioController.deleteUsuario);
exports.default = UsuarioRouter;
