import Router from 'express';
import ViaController from '../controllers/ViaController';

const router = Router();

router.get('/vias/:id', ViaController.getViaById);
router.get('/vias', ViaController.getAllVia);
router.get('/vias/detalhes/:id', ViaController.findDetailedById);

/* TODO: definir rota para criar, editar e deletar vias, se tiver ??:
    router.post('/', ViaController.createVia);
    router.put('/vias/:id', ViaController.updateVia);
    router.delete('/vias/:id', ViaController.deleteVia);
*/

export default router;
