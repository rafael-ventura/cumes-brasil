import { Router } from 'express';

import { UsuarioController } from '../Controllers/UsuarioController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import upload from '../Middlewares/MulterMiddleware';
import { ImagemService } from '../../Application/services/ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';

const usuarioService = new UsuarioService(new UsuarioRepository(), new ImagemService(new ImagemRepository()));
const usuarioController = new UsuarioController(usuarioService);

const UsuarioRouter = Router();

UsuarioRouter.get("/:id", usuarioController.getById);
UsuarioRouter.get("/", usuarioController.getAll);
UsuarioRouter.post("/", usuarioController.registrar);
UsuarioRouter.put('/', upload.single('foto_perfil'), usuarioController.editarDados);
UsuarioRouter.delete("/:id", usuarioController.delete);

// perfil do usuario
UsuarioRouter.get('/perfil/:id', usuarioController.getPerfil);

export default UsuarioRouter;
