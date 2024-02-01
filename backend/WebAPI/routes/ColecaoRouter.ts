import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import { ColecaoController } from '../Controllers/ColecaoController';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';

const colecaoService = new ColecaoService(new ColecaoRepository(dbConnection, new ViaRepository(dbConnection)));
const colecaoViaService = new ViaService(new ViaRepository(dbConnection));
const colecaoController = new ColecaoController(colecaoService, colecaoViaService);

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