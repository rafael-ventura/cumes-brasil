import { Router } from 'express';
import ViaController from '../Controllers/ViaController';


// todo: injecao de dependencia na via controlller.
const ViaRouter = Router();

ViaRouter.get('/:id', ViaController.getViaById);
ViaRouter.get('/', ViaController.getAllVia);
ViaRouter.get('/detailed/:id', ViaController.findDetailedById);


export default ViaRouter;
