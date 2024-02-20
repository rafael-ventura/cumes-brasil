import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {CroquiService} from '../../Application/services/CroquiService';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';

import {CroquiController} from "../Controllers/CroquiController";
import { ViaService } from '../../Application/services/ViaService';
import { FonteService } from '../../Application/services/FonteService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';
import { FaceService } from '../../Application/services/FaceService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';


const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaRepository = new MontanhaRepository(dbConnection);
const montanhaService = new MontanhaService(montanhaRepository, fonteService);
const faceRepository = new FaceRepository(dbConnection);
const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const viaRepository = new ViaRepository(dbConnection);
const viaService = new ViaService(viaRepository, fonteService, montanhaService, faceService);
const croquiRepository = new CroquiRepository(dbConnection);
const croquiService = new CroquiService(croquiRepository, viaRepository);
const croquiController = new CroquiController(croquiService);
viaService.setCroquiService(croquiService);

const CroquiRouter = Router();

CroquiRouter.get('/:id', croquiController.getCroquiById);
CroquiRouter.get('/', croquiController.getAllCroqui);
CroquiRouter.post('/', croquiController.createCroqui);
CroquiRouter.put('/:id', croquiController.updateCroqui);
CroquiRouter.delete('/:id', croquiController.deleteCroqui);
CroquiRouter.post('/associarVia', croquiController.associarCroquiEmVia);
CroquiRouter.post('/desassociarVia', croquiController.desassociarCroquiEmVia);

export default CroquiRouter;