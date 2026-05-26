import { Router } from 'express';
import { ConquistasController } from '../Controllers/ConquistasController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { authenticateToken, optionalAuthenticateToken } from '../Middlewares/AuthenticateMiddleware';

const router = Router();
const controller = new ConquistasController();

router.get('/me', authenticateToken, asyncErrorHandler(controller.obterConquistasMe));
router.get(
  '/usuario/:username',
  optionalAuthenticateToken,
  asyncErrorHandler(controller.obterConquistasPorUsername)
);

export default router;

