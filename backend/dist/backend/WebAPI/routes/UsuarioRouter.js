"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../Controllers/UsuarioController");
const UsuarioService_1 = require("../../Application/services/UsuarioService");
const UsuarioRepository_1 = require("../../Infrastructure/repositories/UsuarioRepository");
const usuarioService = new UsuarioService_1.UsuarioService(new UsuarioRepository_1.UsuarioRepository());
const usuarioController = new UsuarioController_1.UsuarioController(usuarioService);
const UsuarioRouter = (0, express_1.Router)();
UsuarioRouter.get("/:id", usuarioController.getById);
UsuarioRouter.get("/", usuarioController.getAll);
UsuarioRouter.post("/", usuarioController.registrar);
UsuarioRouter.put("/:id", usuarioController.update);
UsuarioRouter.delete("/:id", usuarioController.delete);
// perfil do usuario
UsuarioRouter.get('/perfil/:id', usuarioController.getPerfil);
exports.default = UsuarioRouter;
