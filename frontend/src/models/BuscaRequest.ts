export interface BuscaRequest {
  unifiedSearch?: string; // searchQuery
  selectedMountain?: number | null;
  bairro?: string | null;
  selectedDifficulty?: string | null;
  selectedExtension?: string | null;
  selectedExtensionCategory?: number[] | null;
  selectedCrux?: string | null;
  selectedExposicao?: string | null;
  page: number;
  itemsPerPage?: number;
  entityType?: string;
  colecaoId?: number;
  sortField?: string | null;
  sortOrder?: string | null;
}
