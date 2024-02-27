"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../Infrastructure/config/db"));
const MontanhaController_1 = require("../Controllers/MontanhaController");
const MontanhaService_1 = require("../../Application/services/MontanhaService");
const MontanhaRepository_1 = require("../../Infrastructure/repositories/MontanhaRepository");
const montanhaService = new MontanhaService_1.MontanhaService(new MontanhaRepository_1.MontanhaRepository(db_1.default));
const montanhaController = new MontanhaController_1.MontanhaController(montanhaService);
const MontanhaRouter = (0, express_1.Router)();
MontanhaRouter.get('/:id', montanhaController.getMontanhaById);
MontanhaRouter.get('/', montanhaController.getAllMontanha);
MontanhaRouter.post('/', montanhaController.createMontanha);
MontanhaRouter.put('/:id', montanhaController.updateMontanha);
MontanhaRouter.delete('/:id', montanhaController.deleteMontanha);
exports.default = MontanhaRouter;
