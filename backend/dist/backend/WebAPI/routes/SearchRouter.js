"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/Infrastructure/routes/searchRouter.ts
const express_1 = require("express");
const SearchService_1 = require("../../Application/services/SearchService");
const SearchController_1 = require("../Controllers/SearchController");
const ViaRepository_1 = require("../../Infrastructure/repositories/ViaRepository");
const router = (0, express_1.Router)();
const viaRepository = new ViaRepository_1.ViaRepository();
new SearchService_1.SearchService(viaRepository);
const searchController = new SearchController_1.SearchController();
router.post('/', searchController.searchEntities);
exports.default = router;
