import { Router } from 'express';
import { LocalizacaoController } from '../Controllers/LocalizacaoController';
import { LocalizacaoService } from '../../Application/services/LocalizacaoService';
import { LocalizacaoRepository } from '../../Infrastructure/repositories/LocalizacaoRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const localizacaoRepository = new LocalizacaoRepository();
const localizacaoService = new LocalizacaoService(localizacaoRepository);
const localizacaoController = new LocalizacaoController(localizacaoService);

const LocalizacaoRouter = Router();

LocalizacaoRouter.get('/hierarchy', asyncErrorHandler(localizacaoController.getLocationHierarchy));
LocalizacaoRouter.get('/stats', asyncErrorHandler(localizacaoController.getStatsForExplorer));

export default LocalizacaoRouter;
