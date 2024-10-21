export interface SearchRequest {
  unifiedSearch?: string; // searchQuery
  selectedMountain?: number | null;
  selectedDifficulty?: string | null;
  selectedExtension?: string | null;
  selectedExtensionCategory?: number[] | null;
  selectedCrux?: string | null;
  page?: number;
  itemsPerPage?: number;
  entityType?: string;
  colecaoId?: number;
}
