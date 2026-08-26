import { Router } from 'express';
import { BuscaController } from '../Controllers/BuscaController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const router = Router();
const controller = new BuscaController();

router.post('/', asyncErrorHandler(controller.buscar));

export default router;
