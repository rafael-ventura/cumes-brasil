// src/Infrastructure/routes/searchRouter.ts
import { Router } from 'express';
import { SearchService } from '../../Application/services/SearchService';
import {SearchController} from "../Controllers/SearchController";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {authenticateToken} from "../Middlewares/AuthenticateMiddleware";

const router = Router();
const viaRepository = new ViaRepository();
new SearchService(viaRepository);
const searchController = new SearchController();

router.post('/', authenticateToken ,searchController.searchEntities);

export default router;
