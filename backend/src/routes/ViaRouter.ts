import Router from 'express';
import ViaController from '../controllers/ViaController';

const ViaRouter = Router();

ViaRouter.get('/:id', ViaController.getViaById);
ViaRouter.get('/', ViaController.getAllVia);
ViaRouter.get('/detalhes/:id', ViaController.findDetailedById);

export default ViaRouter;
