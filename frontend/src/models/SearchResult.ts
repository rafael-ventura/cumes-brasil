// src/models/SearchResult.ts
export interface SearchResult<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}
