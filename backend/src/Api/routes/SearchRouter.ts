// src/Infrastructure/routes/searchRouter.ts
import { Router } from 'express';
import {SearchController} from "../Controllers/SearchController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const router = Router();
const searchController = new SearchController();

router.post('/' , asyncErrorHandler(searchController.searchEntities));

export default router;
