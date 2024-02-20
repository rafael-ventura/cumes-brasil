"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../Infrastructure/config/db"));
const FaceController_1 = require("../Controllers/FaceController");
const FaceService_1 = require("../../Application/services/FaceService");
const FaceRepository_1 = require("../../Infrastructure/repositories/FaceRepository");
const faceService = new FaceService_1.FaceService(new FaceRepository_1.FaceRepository(db_1.default));
const faceController = new FaceController_1.FaceController(faceService);
const FaceRouter = (0, express_1.Router)();
FaceRouter.get('/:id', faceController.getFaceById);
FaceRouter.get('/', faceController.getAllFace);
FaceRouter.post('/', faceController.createFace);
FaceRouter.put('/:id', faceController.updateFace);
FaceRouter.delete('/:id', faceController.deleteFace);
exports.default = FaceRouter;
