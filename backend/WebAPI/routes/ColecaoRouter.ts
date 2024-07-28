import { Router } from "express";

import { ColecaoController } from "../Controllers/ColecaoController";
import { ColecaoService } from "../../Application/services/ColecaoService";
import { ColecaoRepository } from "../../Infrastructure/repositories/ColecaoRepository";
import { ViaService } from "../../Application/services/ViaService";
import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { UsuarioService } from "../../Application/services/UsuarioService";
import { UsuarioRepository } from "../../Infrastructure/repositories/UsuarioRepository";

const viaRepository = new ViaRepository();
const colecaoRepository = new ColecaoRepository();
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const viaService = new ViaService(viaRepository);
const colecaoService = new ColecaoService(colecaoRepository);
const colecaoController = new ColecaoController(colecaoService);

const ColecaoRouter = Router();

ColecaoRouter.get("/:id", colecaoController.getById);
ColecaoRouter.get("/", colecaoController.getAllColecao);
ColecaoRouter.post("/", colecaoController.createColecao);
ColecaoRouter.put("/:id", colecaoController.updateColecao);
ColecaoRouter.delete("/:id", colecaoController.deleteColecao);
ColecaoRouter.post("/adicionarVia", colecaoController.adicionarVia);
ColecaoRouter.delete("/:id/via/:viaId", colecaoController.removeVia);
ColecaoRouter.get("/usuario/:id", colecaoController.getByUsuarioId);

export default ColecaoRouter;
