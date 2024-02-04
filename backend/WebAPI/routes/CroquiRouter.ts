import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {CroquiController} from '../Controllers/CroquiController';
import {CroquiService} from '../../Application/services/CroquiService';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import { FonteService } from '../../Application/services/FonteService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';

const croquiService = new CroquiService(new CroquiRepository(dbConnection));
const fonteService = new FonteService(new FonteRepository(dbConnection));
const croquiController = new CroquiController(croquiService, fonteService);

const CroquiRouter = Router();

CroquiRouter.get('/:id', croquiController.getCroquiById);
CroquiRouter.get('/', croquiController.getAllCroqui);
CroquiRouter.post('/', croquiController.createCroqui);
CroquiRouter.put('/:id', croquiController.updateCroqui);
CroquiRouter.delete('/:id', croquiController.deleteCroqui);

export default CroquiRouter;