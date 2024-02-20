import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {MontanhaController} from '../Controllers/MontanhaController';
import {MontanhaService} from '../../Application/services/MontanhaService';
import {MontanhaRepository} from '../../Infrastructure/repositories/MontanhaRepository';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { FonteService } from '../../Application/services/FonteService';


const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaRepository = new MontanhaRepository(dbConnection);
const montanhaService = new MontanhaService(montanhaRepository, fonteService);
const montanhaController = new MontanhaController(montanhaService);

const MontanhaRouter = Router();

MontanhaRouter.get('/:id', montanhaController.getMontanhaById);
MontanhaRouter.get('/', montanhaController.getAllMontanha);
MontanhaRouter.post('/', montanhaController.createMontanha);
MontanhaRouter.put('/:id', montanhaController.updateMontanha);
MontanhaRouter.delete('/:id', montanhaController.deleteMontanha);

export default MontanhaRouter;