export interface ISearchResult<T> {
    items: T[];
    totalPages: number;
    totalItems: number;
}