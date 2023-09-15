import { Router } from 'express';
import ViaController from '../controllers/ViaController';

const routes = Router();

routes.get('/vias', ViaController.listAll);
routes.get('/vias/:id', ViaController.findById);
routes.get('/vias/detalhes/:id', ViaController.findDetailedById);


export default routes;
