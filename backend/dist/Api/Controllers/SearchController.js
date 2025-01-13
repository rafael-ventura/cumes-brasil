"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const SearchService_1 = require("../../Application/services/SearchService");
const ViaRepository_1 = require("../../Infrastructure/repositories/ViaRepository");
const MontanhaRepository_1 = require("../../Infrastructure/repositories/MontanhaRepository");
const ColecaoRepository_1 = require("../../Infrastructure/repositories/ColecaoRepository");
const EscaladaRepository_1 = require("../../Infrastructure/repositories/EscaladaRepository");
class SearchController {
    constructor() {
        this.searchEntities = async (req, res) => {
            try {
                const { entityType, unifiedSearch, selectedMountain, selectedDifficulty, selectedExtensionCategory, selectedCrux, selectedExposicao, colecaoId, bairro, page, itemsPerPage, sortField, sortOrder } = req.body;
                if (!entityType || !this.serviceMap[entityType]) {
                    return res.status(400).json({ error: 'Invalid entity type' });
                }
                // Obtenha o ID do usuário logado (por exemplo, do middleware de autenticação)
                const usuarioId = req.user?.userId;
                // Construa o objeto de filtros a partir da requisição
                const filters = {
                    unifiedSearch,
                    selectedMountain,
                    selectedDifficulty,
                    selectedExtensionCategory,
                    selectedCrux,
                    selectedExposicao,
                    bairro,
                    colecaoId,
                    usuarioId,
                    page,
                    itemsPerPage,
                    sortField,
                    sortOrder
                };
                // Aplique os filtros na consulta ao banco de dados
                const searchResult = await this.serviceMap[entityType].search(filters);
                // Adicione o totalItems ao resultado
                res.json({
                    items: searchResult.items,
                    totalPages: searchResult.totalPages,
                    totalItems: searchResult.totalItems,
                });
            }
            catch (error) {
                console.error("Error searching entities:", error);
                res.status(500).json({ error: 'An error occurred while searching for entities.' });
            }
        };
        this.serviceMap = {
            'via': new SearchService_1.SearchService(new ViaRepository_1.ViaRepository()),
            'montanha': new SearchService_1.SearchService(new MontanhaRepository_1.MontanhaRepository()),
            'colecao': new SearchService_1.SearchService(new ColecaoRepository_1.ColecaoRepository()),
            'escalada': new SearchService_1.SearchService(new EscaladaRepository_1.EscaladaRepository())
            // Adicione mais serviços para outras entidades conforme necessário
        };
    }
}
exports.SearchController = SearchController;
