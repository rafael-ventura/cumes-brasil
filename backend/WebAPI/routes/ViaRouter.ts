import { Router } from 'express';
import dbConnection from '../../Infrastructure/config/db';
import { ViaController } from '../Controllers/ViaController';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { CroquiRepository } from '../../Infrastructure/repositories/CroquiRepository';
import { CroquiService } from '../../Application/services/CroquiService';
import { FonteService } from '../../Application/services/FonteService';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { FonteRepository } from '../../Infrastructure/repositories/FonteRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { FaceService } from '../../Application/services/FaceService';
import { FaceRepository } from '../../Infrastructure/repositories/FaceRepository';

const viaRepository = new ViaRepository(dbConnection);
const croquiRepository = new CroquiRepository(dbConnection);
const croquiService = new CroquiService(croquiRepository, viaRepository);
const fonteService = new FonteService(new FonteRepository(dbConnection)); 
const montanhaRepository = new MontanhaRepository(dbConnection);
const montanhaService = new MontanhaService(montanhaRepository, fonteService);
const faceRepository = new FaceRepository(dbConnection);
const faceService = new FaceService(faceRepository, fonteService, montanhaService);
const viaService = new ViaService(viaRepository, fonteService, montanhaService, faceService);
viaService.setCroquiService(croquiService);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

ViaRouter.get('/:id', viaController.getViaById);
ViaRouter.get('/', viaController.getAllVia);
ViaRouter.post('/', viaController.createVia);
ViaRouter.put('/:id', viaController.updateVia);
ViaRouter.delete('/:id', viaController.deleteVia);
ViaRouter.get('/:id/croquis', viaController.getCroquisByViaId);
ViaRouter.get('/search', viaController.searchRoutes);


export default ViaRouter;
