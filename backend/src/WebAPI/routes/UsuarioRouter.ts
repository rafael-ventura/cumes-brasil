import { Router } from "express";

import { UsuarioController } from "../Controllers/UsuarioController";
import { UsuarioService } from "../../Application/services/UsuarioService";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";

const usuarioService = new UsuarioService(new UsuarioRepository());
const usuarioController = new UsuarioController(usuarioService);

const UsuarioRouter = Router();

UsuarioRouter.get("/:id", usuarioController.getById);
UsuarioRouter.get("/", usuarioController.getAll);
UsuarioRouter.post("/", usuarioController.registrar);
UsuarioRouter.put("/:id", usuarioController.update);
UsuarioRouter.delete("/:id", usuarioController.delete);

// perfil do usuario
UsuarioRouter.get('/perfil/:id', usuarioController.getPerfil);

export default UsuarioRouter;
