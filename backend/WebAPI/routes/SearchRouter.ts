import {Router} from 'express';
import {SearchService} from '../../Application/services/SearchService';
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {SearchController} from "../Controllers/SearchController";

const searchRepository = new SearchRepository(dbConnection);
const viaRepository = new ViaRepository(dbConnection);
const viaService = new SearchService(searchRepository, viaRepository);
const searchController = new SearchController(viaService);

const ViaRouter = Router();

ViaRouter.get('/', searchController.searchRoutes);

export default ViaRouter;
