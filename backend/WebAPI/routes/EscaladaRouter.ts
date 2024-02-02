import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { EscaladaService } from '../../Application/services/EscaladaService';
import { EscaladaController } from '../Controllers/EscaladaController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';

const usuarioService = new UsuarioService(new UsuarioRepository(dbConnection))
const escaladaService = new EscaladaService(new EscaladaRepository(dbConnection));
const escaladaController = new EscaladaController(escaladaService, usuarioService);

const EscaladaRouter = Router();

EscaladaRouter.get('/:id', escaladaController.getEscaladaById);
EscaladaRouter.get('/', escaladaController.getAllEscalada);
EscaladaRouter.post('/', escaladaController.createEscalada);
EscaladaRouter.put('/', escaladaController.updateEscalada);
EscaladaRouter.delete('/:id', escaladaController.deleteEscalada);
EscaladaRouter.get('/usuario/:usuarioId', escaladaController.getEscaladasDoUsuario);


export default EscaladaRouter;