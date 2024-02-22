import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {FaceController} from '../Controllers/FaceController';
import {FaceService} from '../../Application/services/FaceService';
import {FaceRepository} from '../../Infrastructure/repositories/FaceRepository';
import { FonteService } from '../../Application/services/FonteService';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';

const fonteRepository = new FonteRepository(dbConnection);
const fonteService = new FonteService(fonteRepository);
const montanhaRepository = new MontanhaRepository(dbConnection);
const montanhaService = new MontanhaService(montanhaRepository, fonteService);
const faceRepository = new FaceRepository(dbConnection);
const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const faceController = new FaceController(faceService);

const FaceRouter = Router();

FaceRouter.get('/:id', faceController.getFaceById);
FaceRouter.get('/', faceController.getAllFace);
FaceRouter.post('/', faceController.createFace);
FaceRouter.put('/:id', faceController.updateFace);
FaceRouter.delete('/:id', faceController.deleteFace);

export default FaceRouter;