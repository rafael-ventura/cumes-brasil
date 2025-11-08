import { Router } from 'express';

import { ColecaoController } from '../Controllers/ColecaoController';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const colecaoRepository = new ColecaoRepository();
const colecaoService = new ColecaoService(colecaoRepository);
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get("/:id", asyncErrorHandler(colecaoController.getById));
ColecaoRouter.get("/", asyncErrorHandler(colecaoController.getAllColecao));
ColecaoRouter.post("/", asyncErrorHandler(colecaoController.createColecao));
ColecaoRouter.put("/:id", asyncErrorHandler(colecaoController.updateColecao));
ColecaoRouter.delete("/:id", asyncErrorHandler(colecaoController.deleteColecao));
ColecaoRouter.post("/adicionarVia", asyncErrorHandler(colecaoController.adicionarVia));
ColecaoRouter.post("/removerVia", asyncErrorHandler(colecaoController.removeVia));
ColecaoRouter.get("/usuario/:id", asyncErrorHandler(colecaoController.getByUsuarioId));
ColecaoRouter.get('/not-containing-via/:viaId', asyncErrorHandler(colecaoController.getColecoesNotContainingViaForUser));

export default ColecaoRouter;
