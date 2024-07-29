import { ISearchResult } from "../../Domain/interfaces/models/ISearchResult";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";

export class SearchService<T> {
    private repository: ISearchRepository<T>;

    constructor(repository: any) {
        this.repository = repository;
    }

    async search(filters: any): Promise<ISearchResult<T>> {
        // Aqui você deve ajustar o retorno para seguir a interface ISearchResult
        console.log("Searching for entities with filters: ", filters);
        const items = await this.repository.search(filters);
        const totalItems = await this.repository.count(filters);
        const totalPages = Math.ceil(totalItems / (filters.itemsPerPage || 10)); // Ajuste a lógica conforme necessário

        return {
            items,
            totalPages,
            totalItems
        };
    }
}
