import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";

export class SearchService<T> {
    private repository: ISearchRepository<T>;

    constructor(repository: ISearchRepository<T>) {
        this.repository = repository;
    }

    async search(query: any): Promise<T[]> {
        return await this.repository.search(query);
    }
}
