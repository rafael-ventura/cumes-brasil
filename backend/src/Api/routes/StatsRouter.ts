import { Router } from 'express';
import { StatsController } from '../Controllers/StatsController';
import { StatsService } from '../../Application/services/StatsService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const statsService = new StatsService(
    new ViaRepository(),
    new MontanhaRepository(),
    new UsuarioRepository()
);
const statsController = new StatsController(statsService);

const StatsRouter = Router();

StatsRouter.get("/", asyncErrorHandler(statsController.getGeneralStats));

export default StatsRouter;

