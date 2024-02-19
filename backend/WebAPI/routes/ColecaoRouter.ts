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
const usuarioRepository = new UsuarioRepository(dbConnection);
const usuarioService = new UsuarioService(usuarioRepository);
const croquiService = new CroquiService(croquiRepository);
const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaService = new MontanhaService(new MontanhaRepository(dbConnection));
const faceService = new FaceService(new FaceRepository(dbConnection));
const viaService = new ViaService(viaRepository, croquiService, fonteService, montanhaService, faceService);
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
ColecaoRouter.get('/:usuarioId/:colecaoId', colecaoController.getViasByColecao);


export default ColecaoRouter;