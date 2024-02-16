import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {ColecaoController} from '../Controllers/ColecaoController';
import {ColecaoService} from '../../Application/services/ColecaoService';
import {ColecaoRepository} from '../../Infrastructure/repositories/ColecaoRepository';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';


const viaRepository = new ViaRepository(dbConnection, new CroquiRepository(dbConnection));
const croquiRepository = new CroquiRepository(dbConnection);
const colecaoRepository = new ColecaoRepository(dbConnection, viaRepository, croquiRepository);
const colecaoService = new ColecaoService(colecaoRepository, viaRepository);
const viaService = new ViaService(viaRepository, new CroquiRepository(dbConnection));
const colecaoController = new ColecaoController(colecaoService, viaService);


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