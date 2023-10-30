import Router from 'express';
import ViaController from '../controllers/ViaController';

const ViaRouter = Router();

ViaRouter.get('/:id', ViaController.getViaById);
ViaRouter.get('/', ViaController.getAllVia);
ViaRouter.get('/detalhes/:id', ViaController.findDetailedById);

/* TODO: definir rota para criar, editar e deletar vias, se tiver ??:
    router.post('/', ViaController.createVia);
    router.put('/vias/:id', ViaController.updateVia);
    router.delete('/vias/:id', ViaController.deleteVia);
*/

export default ViaRouter;
