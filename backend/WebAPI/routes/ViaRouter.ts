// ViaRoute.ts
import { Router } from 'express';
import { ViaController } from '../Controllers/ViaController';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import store from '../../Infrastructure/config/db';

// Crie uma instância de ViaService e passe-a para o construtor do ViaController
const viaService = new ViaService(new ViaRepository(store));
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get('/:id', viaController.getViaById);
ViaRouter.get('/', viaController.getAllVia);
ViaRouter.post('/', viaController.createVia);
ViaRouter.put('/', viaController.updateVia);
ViaRouter.delete('d/:id', viaController.deleteVia);


export default ViaRouter;
