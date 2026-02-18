import { Router } from 'express';
import { Container } from 'typedi';
import { ColecaoController } from '../Controllers/ColecaoController';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const colecaoController = Container.get(ColecaoController);

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
