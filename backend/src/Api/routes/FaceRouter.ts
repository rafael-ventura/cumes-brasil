import { Router } from "express";
import { Container } from 'typedi';
import { FaceController } from "../Controllers/FaceController";
import { asyncErrorHandler } from '../Middlewares/ErrorRequestMiddleware';

const faceController = Container.get(FaceController);

const FaceRouter = Router();

FaceRouter.get("/:id", asyncErrorHandler(faceController.getFaceById));
FaceRouter.get("/", asyncErrorHandler(faceController.getAllFace));
FaceRouter.post("/", asyncErrorHandler(faceController.createFace));
FaceRouter.put("/:id", asyncErrorHandler(faceController.updateFace));
FaceRouter.delete("/:id", asyncErrorHandler(faceController.deleteFace));

export default FaceRouter;
