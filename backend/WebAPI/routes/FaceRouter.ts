import {Router} from 'express';
import dbConnection from '../../Infrastructure/config/db';
import {FaceController} from '../Controllers/FaceController';
import {FaceService} from '../../Application/services/FaceService';
import {FaceRepository} from '../../Infrastructure/repositories/FaceRepository';

const faceService = new FaceService(new FaceRepository(dbConnection));
const faceController = new FaceController(faceService);

const FaceRouter = Router();

FaceRouter.get('/:id', faceController.getFaceById);
FaceRouter.get('/', faceController.getAllFace);
FaceRouter.post('/', faceController.createFace);
FaceRouter.put('/:id', faceController.updateFace);
FaceRouter.delete('/:id', faceController.deleteFace);

export default FaceRouter;