import { Router } from 'express';
import ShareController from '../Controllers/ShareController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const router = Router();
const controller = new ShareController();

router.get('/perfil/:username', asyncErrorHandler(controller.obterPaginaCompartilhamentoPerfil));
router.get('/via/:id', asyncErrorHandler(controller.obterPaginaCompartilhamentoVia));
router.get('/escalada/:id', asyncErrorHandler(controller.obterPaginaCompartilhamentoEscalada));

export default router;

