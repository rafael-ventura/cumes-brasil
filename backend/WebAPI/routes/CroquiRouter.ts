import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {CroquiController} from '../Controllers/CroquiController';
import {CroquiService} from '../../Application/services/CroquiService';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import { FonteService } from '../../Application/services/FonteService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';

const croquiService = new CroquiService(new CroquiRepository(dbConnection));
const fonteService = new FonteService(new FonteRepository(dbConnection));
const viaService = new ViaService(new ViaRepository(dbConnection, new CroquiRepository(dbConnection)));
const croquiController = new CroquiController(croquiService, fonteService, viaService);

const CroquiRouter = Router();

CroquiRouter.get('/:id', croquiController.getCroquiById);
CroquiRouter.get('/', croquiController.getAllCroqui);
CroquiRouter.post('/', croquiController.createCroqui);
CroquiRouter.put('/:id', croquiController.updateCroqui);
CroquiRouter.delete('/:id', croquiController.deleteCroqui);
CroquiRouter.post('/associarVia', croquiController.associarVia);
CroquiRouter.post('/desassociarVia/:viaId/:croquiId', croquiController.desassociar);

export default CroquiRouter;