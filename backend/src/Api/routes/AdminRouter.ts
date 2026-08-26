import { Router } from 'express';
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';
import { ViaImageSugestaoController } from '../Controllers/Admin/ViaImageSugestaoController';
import { AdminViaController } from '../Controllers/Admin/AdminViaController';
import { AdminUsuarioController } from '../Controllers/Admin/AdminUsuarioController';

const AdminRouter = Router();

const sugestaoCtrl = new ViaImageSugestaoController();
const viaCtrl = new AdminViaController();
const usuarioCtrl = new AdminUsuarioController();

// Sugestões de imagem
AdminRouter.get('/sugestoes',              asyncErrorHandler(sugestaoCtrl.listarTodas));
AdminRouter.get('/sugestoes/pendentes',    asyncErrorHandler(sugestaoCtrl.listarPendentes));
AdminRouter.patch('/sugestoes/:id/aprovar',  asyncErrorHandler(sugestaoCtrl.aprovar));
AdminRouter.patch('/sugestoes/:id/rejeitar', asyncErrorHandler(sugestaoCtrl.rejeitar));

// Vias
AdminRouter.get('/vias',          asyncErrorHandler(viaCtrl.listar));
AdminRouter.get('/vias/:id',      asyncErrorHandler(viaCtrl.buscarPorId));
AdminRouter.post('/vias',         asyncErrorHandler(viaCtrl.criar));
AdminRouter.put('/vias/:id',      asyncErrorHandler(viaCtrl.atualizar));
AdminRouter.delete('/vias/:id',   asyncErrorHandler(viaCtrl.deletar));

// Usuários
AdminRouter.get('/usuarios',                     asyncErrorHandler(usuarioCtrl.listar));
AdminRouter.get('/usuarios/estatisticas',        asyncErrorHandler(usuarioCtrl.estatisticas));
AdminRouter.patch('/usuarios/:id/toggle-admin',  asyncErrorHandler(usuarioCtrl.toggleAdmin));
AdminRouter.patch('/usuarios/:id/papel',         asyncErrorHandler(usuarioCtrl.definirPapel));

export default AdminRouter;
