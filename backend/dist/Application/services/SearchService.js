"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
class SearchService {
    constructor(repository) {
        this.repository = repository;
    }
    async search(filters) {
        try {
            // Chama o método de pesquisa do repositório
            const { items, totalItems, totalPages } = await this.repository.search(filters);
            return {
                items,
                totalPages,
                totalItems
            };
        }
        catch (error) {
            console.error("Error in search method:", error);
            throw error;
        }
    }
}
exports.SearchService = SearchService;
