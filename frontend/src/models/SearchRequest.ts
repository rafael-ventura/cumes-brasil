export interface SearchRequest {
  searchQuery?: string;
  selectedMountain?: number | null;
  selectedDifficulty?: string | null;
  selectedExposure?: string | null;
  page?: number;
  itemsPerPage?: number;
  entityType?: string;
}
