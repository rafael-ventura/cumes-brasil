import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {ViaController} from '../Controllers/ViaController';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import {CroquiService} from '../../Application/services/CroquiService';

const croquiRepository = new CroquiRepository(dbConnection);
const croquiService = new CroquiService(croquiRepository);
const viaRepository = new ViaRepository(dbConnection, croquiRepository);
const viaService = new ViaService(viaRepository, croquiRepository);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get('/:id', viaController.getViaById);
ViaRouter.get('/', viaController.getAllVia);
ViaRouter.post('/', viaController.createVia);
ViaRouter.put('/:id', viaController.updateVia);
ViaRouter.delete('/:id', viaController.deleteVia);
ViaRouter.get('/:id/croquis', viaController.getCroquisByViaId);

export default ViaRouter;
