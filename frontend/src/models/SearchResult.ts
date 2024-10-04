// src/models/SearchResult.ts
import { Via } from 'src/models/Via';

export interface SearchResult {
  items: Via[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}
