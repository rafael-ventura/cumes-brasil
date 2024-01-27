import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {CroquiController} from '../Controllers/CroquiController';
import {CroquiService} from '../../Application/services/CroquiService';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';

const croquiService = new CroquiService(new CroquiRepository(dbConnection));
const croquiController = new CroquiController(croquiService);

const CroquiRouter = Router();

CroquiRouter.get('/:id', croquiController.getCroquiById);
CroquiRouter.get('/', croquiController.getAllCroqui);
CroquiRouter.post('/', croquiController.createCroqui);
CroquiRouter.put('/:id', croquiController.updateCroqui);
CroquiRouter.delete('/:id', croquiController.deleteCroqui);

export default CroquiRouter;