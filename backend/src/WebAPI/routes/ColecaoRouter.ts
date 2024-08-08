import { Router } from 'express';

import { ColecaoController } from '../Controllers/ColecaoController';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';

const colecaoRepository = new ColecaoRepository();
const colecaoService = new ColecaoService(colecaoRepository);
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get("/:id", colecaoController.getById);
ColecaoRouter.get("/", colecaoController.getAllColecao);
ColecaoRouter.post("/", colecaoController.createColecao);
ColecaoRouter.put("/:id", colecaoController.updateColecao);
ColecaoRouter.delete("/:id", colecaoController.deleteColecao);
ColecaoRouter.post("/adicionarVia", colecaoController.adicionarVia);
ColecaoRouter.post("/removerVia", colecaoController.removeVia);
ColecaoRouter.get("/usuario/:id", colecaoController.getByUsuarioId);
ColecaoRouter.get('/not-containing-via/:viaId', colecaoController.getColecoesNotContainingVia);

export default ColecaoRouter;
