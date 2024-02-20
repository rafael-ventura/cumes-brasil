import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {ColecaoController} from '../Controllers/ColecaoController';
import {ColecaoService} from '../../Application/services/ColecaoService';
import {ColecaoRepository} from '../../Infrastructure/repositories/ColecaoRepository';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import { CroquiService } from '../../Application/services/CroquiService';
import { FonteService } from '../../Application/services/FonteService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FaceService } from '../../Application/services/FaceService';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';

const viaRepository = new ViaRepository(dbConnection);
const colecaoRepository = new ColecaoRepository(dbConnection);
const croquiRepository = new CroquiRepository(dbConnection);
const croquiService = new CroquiService(croquiRepository, viaRepository);
const usuarioRepository = new UsuarioRepository(dbConnection);
const usuarioService = new UsuarioService(usuarioRepository);
const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaRepository = new MontanhaRepository(dbConnection);
const montanhaService = new MontanhaService(montanhaRepository, fonteService);
const faceRepository = new FaceRepository(dbConnection);
const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const viaService = new ViaService(viaRepository, fonteService, montanhaService, faceService);
viaService.setCroquiService(croquiService);
const colecaoService = new ColecaoService(colecaoRepository, viaService, usuarioService);
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get('/:id', colecaoController.getColecaoById);
ColecaoRouter.get('/', colecaoController.getAllColecao);
ColecaoRouter.post('/', colecaoController.createColecao);
ColecaoRouter.put('/', colecaoController.updateColecao);
ColecaoRouter.delete('/:id', colecaoController.deleteColecao);
ColecaoRouter.post('/addVia', colecaoController.addVia);
ColecaoRouter.delete('/removeVia/:colecaoId/:viaId', colecaoController.removeVia);
ColecaoRouter.get('/colecoesDoUsuario/:usuarioId', colecaoController.getColecoesByUsuarioId);


export default ColecaoRouter;