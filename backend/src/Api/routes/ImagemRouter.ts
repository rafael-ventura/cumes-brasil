import { Router } from "express";
import { ImagemController } from "../Controllers/ImagemController";
import { ImagemService } from "../../Application/services/ImagemService";
import { ImagemRepository } from "../../Infrastructure/repositories/ImagemRepository";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const imagemService = new ImagemService(new ImagemRepository());
const imagemController = new ImagemController(imagemService);

const ImagemRouter = Router();

ImagemRouter.get("/:id", asyncErrorHandler(imagemController.getImagemById));
ImagemRouter.get("/", asyncErrorHandler(imagemController.getAllImagem));
ImagemRouter.post("/", asyncErrorHandler(imagemController.createImagem));
ImagemRouter.put("/:id", asyncErrorHandler(imagemController.updateImagem));
ImagemRouter.delete("/:id", asyncErrorHandler(imagemController.deleteImagem));
ImagemRouter.get("/colecao/:id", asyncErrorHandler(imagemController.getByColecaoId));
ImagemRouter.get("/usuario/:id", asyncErrorHandler(imagemController.getByUsuarioId));
ImagemRouter.get("/montanha/:id", asyncErrorHandler(imagemController.getByMontanhaId));
ImagemRouter.get("/via/:id", asyncErrorHandler(imagemController.getByViaId));
ImagemRouter.get("/croqui/:id", asyncErrorHandler(imagemController.getByCroquiId));

export default ImagemRouter;
