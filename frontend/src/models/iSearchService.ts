interface ISearchService<T> {
  search(query: any): Promise<T[]>;
}
