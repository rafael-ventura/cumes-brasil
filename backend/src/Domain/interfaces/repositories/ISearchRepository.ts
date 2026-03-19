import { ISearchResult } from '../models/ISearchResult';
import { FiltrosBuscaBase } from '../models/FiltrosBusca';

export interface ISearchRepository<T> {
    search(filtros: FiltrosBuscaBase): Promise<ISearchResult<T>>;
}
