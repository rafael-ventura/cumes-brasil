"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/Infrastructure/routes/searchRouter.ts
const express_1 = require("express");
const SearchService_1 = require("../../Application/services/SearchService");
const SearchController_1 = require("../Controllers/SearchController");
const ViaRepository_1 = require("../../Infrastructure/repositories/ViaRepository");
const AuthenticateMiddleware_1 = require("../Middlewares/AuthenticateMiddleware");
const router = (0, express_1.Router)();
const viaRepository = new ViaRepository_1.ViaRepository();
new SearchService_1.SearchService(viaRepository);
const searchController = new SearchController_1.SearchController();
router.post('/', AuthenticateMiddleware_1.authenticateToken, searchController.searchEntities);
exports.default = router;
