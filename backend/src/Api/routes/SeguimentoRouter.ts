import { Router } from 'express';
import { SeguimentoController } from '../Controllers/SeguimentoController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { authenticateToken, optionalAuthenticateToken } from '../Middlewares/AuthenticateMiddleware';

const router = Router();
const controller = new SeguimentoController();

router.get('/estatisticas/me', authenticateToken, asyncErrorHandler(controller.obterEstatisticasMe));

router.get('/seguindo/me', authenticateToken, asyncErrorHandler(controller.listarSeguindoMe));
router.get('/seguidores/me', authenticateToken, asyncErrorHandler(controller.listarSeguidoresMe));

// Quando visitante (sem token), apenas conta os números.
router.get(
  '/estatisticas/:username',
  optionalAuthenticateToken,
  asyncErrorHandler(controller.obterEstatisticasPorUsername)
);

router.post('/seguir/:username', authenticateToken, asyncErrorHandler(controller.seguirUsuario));
router.delete('/seguir/:username', authenticateToken, asyncErrorHandler(controller.deixarDeSeguirUsuario));

export default router;

