import { Router } from "express";

import { UsuarioController } from "../Controllers/UsuarioController";
import { UsuarioService } from "../../Application/services/UsuarioService";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";

const usuarioService = new UsuarioService(new UsuarioRepository());
const usuarioController = new UsuarioController(usuarioService)

const PerfilRouter = Router();

// perfil do Usuario
PerfilRouter.get('/', usuarioController.getPerfil);
PerfilRouter.put('/', usuarioController.editarDados);


export default PerfilRouter;
