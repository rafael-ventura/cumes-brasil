import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { FiltrosBuscaBase } from '../../Domain/interfaces/models/FiltrosBusca';

export class SearchService<T> {
    private repository: ISearchRepository<T>;

    constructor(repository: ISearchRepository<T>) {
        this.repository = repository;
    }

    async search(filtros: FiltrosBuscaBase): Promise<ISearchResult<T>> {
        return this.repository.search(filtros);
    }
}
