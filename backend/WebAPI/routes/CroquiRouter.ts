import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {CroquiService} from '../../Application/services/CroquiService';
import {CroquiRepository} from '../../Infrastructure/repositories/CroquiRepository';
import {ViaService} from '../../Application/services/ViaService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {CroquiController} from "../Controllers/CroquiController";
import { FonteService } from '../../Application/services/FonteService';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { FaceService } from '../../Application/services/FaceService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';

const croquiRepository = new CroquiRepository(dbConnection);
const croquiService = new CroquiService(new CroquiRepository(dbConnection));
const viaRepository = new ViaRepository(dbConnection);
const fonteService = new FonteService(new FonteRepository(dbConnection));
const montanhaService = new MontanhaService(new MontanhaRepository(dbConnection));
const faceService = new FaceService(new FaceRepository(dbConnection));
const viaService = new ViaService(viaRepository, croquiService, fonteService, montanhaService, faceService);
const croquiController = new CroquiController(croquiService, viaService);

const CroquiRouter = Router();

CroquiRouter.get('/:id', croquiController.getCroquiById);
CroquiRouter.get('/', croquiController.getAllCroqui);
CroquiRouter.post('/', croquiController.createCroqui);
CroquiRouter.put('/:id', croquiController.updateCroqui);
CroquiRouter.delete('/:id', croquiController.deleteCroqui);
CroquiRouter.post('/associarVia', croquiController.associarVia);
CroquiRouter.post('/desassociarVia/:viaId/:croquiId', croquiController.desassociar);

export default CroquiRouter;