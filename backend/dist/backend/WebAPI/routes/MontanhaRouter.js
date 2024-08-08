"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MontanhaController_1 = require("../Controllers/MontanhaController");
const MontanhaService_1 = require("../../Application/services/MontanhaService");
const MontanhaRepository_1 = require("../../Infrastructure/repositories/MontanhaRepository");
const montanhaRepository = new MontanhaRepository_1.MontanhaRepository();
const montanhaService = new MontanhaService_1.MontanhaService(montanhaRepository);
const montanhaController = new MontanhaController_1.MontanhaController(montanhaService);
const MontanhaRouter = (0, express_1.Router)();
MontanhaRouter.get("/:id", montanhaController.getMontanhaById);
MontanhaRouter.get("/", montanhaController.getAllMontanha);
exports.default = MontanhaRouter;
