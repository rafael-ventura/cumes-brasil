import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {UsuarioController} from '../Controllers/UsuarioController';
import {UsuarioService} from '../../Application/services/UsuarioService';
import {UsuarioRepository} from '../../Infrastructure/repositories/UsuarioRepository';

const usuarioService = new UsuarioService(new UsuarioRepository(dbConnection));
const usuarioController = new UsuarioController(usuarioService);

const UsuarioRouter = Router();

UsuarioRouter.get('/:id', usuarioController.getUsuarioById);
UsuarioRouter.get('/', usuarioController.getAllUsuario);
UsuarioRouter.post('/', usuarioController.createUsuario);
UsuarioRouter.put('/', usuarioController.updateUsuario);
UsuarioRouter.delete('/:id', usuarioController.deleteUsuario);

export default UsuarioRouter;