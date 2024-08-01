export interface SearchRequest {
  searchQuery?: string;
  selectedMountain?: number | null;
  selectedDifficulty?: string | null;
  selectedExtension?: string | null;
  selectedExtensionCategory?: number[] | null;
  selectedCrux?: string | null;
  page?: number;
  itemsPerPage?: number;
  entityType?: string;
}
