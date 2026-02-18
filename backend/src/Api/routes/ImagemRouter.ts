import { Router } from "express";
import { Container } from 'typedi';
import { ImagemController } from "../Controllers/ImagemController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const imagemController = Container.get(ImagemController);

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
