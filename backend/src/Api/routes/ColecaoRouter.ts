import { Router } from 'express';

import { ColecaoController } from '../Controllers/ColecaoController';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ImagemService } from '../../Application/services/ImagemService';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { MulterMiddleware } from '../Middlewares/MulterMiddleware';

const colecaoRepository = new ColecaoRepository();
const imagemRepository = new ImagemRepository();
const imagemService = new ImagemService(imagemRepository);
const colecaoService = new ColecaoService(colecaoRepository, imagemService, imagemRepository);
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get('/usuario/:id', asyncErrorHandler(colecaoController.getByUsuarioId));
ColecaoRouter.get('/not-containing-via/:viaId', asyncErrorHandler(colecaoController.getColecoesNotContainingViaForUser));

ColecaoRouter.post('/adicionarVia', asyncErrorHandler(colecaoController.adicionarVia));
ColecaoRouter.post('/removerVia', asyncErrorHandler(colecaoController.removeVia));
ColecaoRouter.post('/remover-vias-lote', asyncErrorHandler(colecaoController.removerViasEmLote));

ColecaoRouter.put(
  '/:id/capa',
  MulterMiddleware.uploadColecaoCapa,
  asyncErrorHandler(colecaoController.putCapaColecao)
);
ColecaoRouter.delete('/:id/capa', asyncErrorHandler(colecaoController.deleteCapaColecao));

ColecaoRouter.get('/:id', asyncErrorHandler(colecaoController.getById));
ColecaoRouter.get('/', asyncErrorHandler(colecaoController.getAllColecao));
ColecaoRouter.post('/', asyncErrorHandler(colecaoController.createColecao));
ColecaoRouter.put('/:id', asyncErrorHandler(colecaoController.updateColecao));
ColecaoRouter.delete('/:id', asyncErrorHandler(colecaoController.deleteColecao));

export default ColecaoRouter;
