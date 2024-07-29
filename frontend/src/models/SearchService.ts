export interface SearchService<T> {
  search(query: any): Promise<T[]>;
}
