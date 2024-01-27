import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {ViaController} from '../Controllers/ViaController';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';

const viaService = new ViaService(new ViaRepository(dbConnection));
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get('/:id', viaController.getViaById);
ViaRouter.get('/', viaController.getAllVia);
ViaRouter.post('/', viaController.createVia);
ViaRouter.put('/id', viaController.updateVia);
ViaRouter.delete('/:id', viaController.deleteVia);

export default ViaRouter;
