import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {ViaController} from '../Controllers/ViaController';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import {CroquiService} from '../../Application/services/CroquiService';
import { FonteService } from '../../Application/services/FonteService';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FaceService } from '../../Application/services/FaceService';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';

const croquiRepository = new CroquiRepository(dbConnection);
const viaRepository = new ViaRepository(dbConnection);
const croquiService = new CroquiService(croquiRepository);
const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaService = new MontanhaService(new MontanhaRepository(dbConnection));
const faceService = new FaceService(new FaceRepository(dbConnection));
const viaService = new ViaService(viaRepository, croquiService, fonteService, montanhaService, faceService);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get('/:id', viaController.getViaById);
ViaRouter.get('/', viaController.getAllVia);
ViaRouter.post('/', viaController.createVia);
ViaRouter.put('/:id', viaController.updateVia);
ViaRouter.delete('/:id', viaController.deleteVia);
ViaRouter.get('/:id/croquis', viaController.getCroquisByViaId);

export default ViaRouter;
