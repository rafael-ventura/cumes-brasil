import { Router } from 'express';
import { Container } from 'typedi';
import {SearchController} from "../Controllers/SearchController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const router = Router();
const searchController = Container.get(SearchController);

router.post('/' , asyncErrorHandler(searchController.searchEntities));

export default router;
