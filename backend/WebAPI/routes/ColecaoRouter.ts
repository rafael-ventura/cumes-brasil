import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import { ColecaoController } from '../Controllers/ColecaoController';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { ColecaoBaseRepository } from '../../Infrastructure/repositories/ColecaoBaseRepository';


const colecaoService = new ColecaoService(new ColecaoBaseRepository(dbConnection));
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get('/:id', colecaoController.getColecaoById);
ColecaoRouter.get('/', colecaoController.getAllColecao);
ColecaoRouter.post('/', colecaoController.createColecao);
ColecaoRouter.put('/', colecaoController.updateColecao);
ColecaoRouter.delete('/:id', colecaoController.deleteColecao);

export default ColecaoRouter;