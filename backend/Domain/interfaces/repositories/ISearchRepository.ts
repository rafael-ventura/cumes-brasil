// ISearchRepository.ts
export interface ISearchRepository<T> {
    search(query: any): Promise<T[]>;
}