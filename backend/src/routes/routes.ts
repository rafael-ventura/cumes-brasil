import { Router } from 'express';
import ViaController from '../controllers/ViaController';

const routes = Router();

routes.get('/vias', ViaController.listAll);
routes.get('/vias/:id', ViaController.detail);
routes.get('/vias/detalhes/:id', ViaController.detailedDetail);

export default routes;
