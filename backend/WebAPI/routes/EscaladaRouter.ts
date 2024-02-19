import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { EscaladaService } from '../../Application/services/EscaladaService';
import { EscaladaController } from '../Controllers/EscaladaController';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { CroquiRepository } from '../../Infrastructure/repositories/CroquiRepository';
import { CroquiService } from '../../Application/services/CroquiService';
import { FonteService } from '../../Application/services/FonteService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FaceService } from '../../Application/services/FaceService';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';

const usuarioService = new UsuarioService(new UsuarioRepository(dbConnection));
const escaladaRepository = new EscaladaRepository(dbConnection);
const viaRepository = new ViaRepository(dbConnection);
const croquiService = new CroquiService(new CroquiRepository(dbConnection));
const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaService = new MontanhaService(new MontanhaRepository(dbConnection));
const faceService = new FaceService(new FaceRepository(dbConnection));
const viaService = new ViaService(viaRepository, croquiService, fonteService, montanhaService, faceService);
const escaladaService = new EscaladaService(escaladaRepository , usuarioService, viaService);
const escaladaController = new EscaladaController(escaladaService, usuarioService);

const EscaladaRouter = Router();

EscaladaRouter.get('/:id', escaladaController.getEscaladaById);
EscaladaRouter.get('/', escaladaController.getAllEscalada);
EscaladaRouter.post('/', escaladaController.createEscalada);
EscaladaRouter.put('/:id', escaladaController.updateEscalada);
EscaladaRouter.delete('/:id', escaladaController.deleteEscalada);
EscaladaRouter.get('/usuario/:usuarioId', escaladaController.getEscaladasDoUsuario);


export default EscaladaRouter;