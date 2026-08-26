import { Router } from 'express';
import { ViaController } from '../Controllers/ViaController';
import { ViaService } from '../../Application/services/ViaService';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { authenticateToken } from '../Middlewares/AuthenticateMiddleware';
import { requireAdmin } from '../Middlewares/AdminMiddleware';

const viaRepository = new ViaRepository();
const viaService = new ViaService(viaRepository);
const viaController = new ViaController(viaService);

const ViaRouter = Router();

// Rotas públicas de leitura — ordem importa: estáticas antes de /:id
ViaRouter.get("/random", asyncErrorHandler(viaController.aleatoria));
ViaRouter.get('/count/:filter', asyncErrorHandler(viaController.contarPorFiltro));
ViaRouter.get("/colecao/not/:id", asyncErrorHandler(viaController.listarForaDeColecao));
ViaRouter.get("/colecao/:id", asyncErrorHandler(viaController.listarPorColecao));
ViaRouter.get("/:id", asyncErrorHandler(viaController.buscarPorId));
ViaRouter.get("/", asyncErrorHandler(viaController.listar));

// Mutações — somente admin
ViaRouter.post("/", authenticateToken, requireAdmin, asyncErrorHandler(viaController.criar));
ViaRouter.put("/:id", authenticateToken, requireAdmin, asyncErrorHandler(viaController.atualizar));
ViaRouter.delete("/:id", authenticateToken, requireAdmin, asyncErrorHandler(viaController.deletar));

export default ViaRouter;
