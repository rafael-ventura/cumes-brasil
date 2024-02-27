"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../Infrastructure/config/db"));
const FonteController_1 = require("../Controllers/FonteController");
const FonteService_1 = require("../../Application/services/FonteService");
const FonteRepository_1 = require("../../Infrastructure/repositories/FonteRepository");
const fonteService = new FonteService_1.FonteService(new FonteRepository_1.FonteRepository(db_1.default));
const fonteController = new FonteController_1.FonteController(fonteService);
const FonteRouter = (0, express_1.Router)();
FonteRouter.get('/:id', fonteController.getFonteById);
FonteRouter.get('/', fonteController.getAllFonte);
FonteRouter.post('/', fonteController.createFonte);
FonteRouter.put('/:d', fonteController.updateFonte);
FonteRouter.delete('/:id', fonteController.deleteFonte);
exports.default = FonteRouter;
