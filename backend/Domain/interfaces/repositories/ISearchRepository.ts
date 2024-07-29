// ISearchRepository.ts
import {ISearchResult} from "../models/ISearchResult";

export interface ISearchRepository<T> {
    search(query: any): Promise<ISearchResult<T>>;
}