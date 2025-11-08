import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';

export class SearchService<T> {
    private repository: ISearchRepository<T>;

    constructor(repository: any) {
        this.repository = repository;
    }

    async search(filters: any): Promise<ISearchResult<T>> {
        const { items, totalItems, totalPages }: any = await this.repository.search(filters);
        return {
            items,
            totalPages,
            totalItems
        };
    }
}
