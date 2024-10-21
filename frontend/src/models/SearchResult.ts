// src/models/SearchResult.ts
import { Via } from 'src/models/Via';

export interface SearchResult {
  items: Via[] | any[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}
