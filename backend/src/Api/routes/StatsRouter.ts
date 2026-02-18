import { Router } from 'express';
import { Container } from 'typedi';
import { StatsController } from '../Controllers/StatsController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const statsController = Container.get(StatsController);

const StatsRouter = Router();

StatsRouter.get("/", asyncErrorHandler(statsController.getGeneralStats));

export default StatsRouter;

