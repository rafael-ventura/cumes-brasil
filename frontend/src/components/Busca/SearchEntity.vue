<template>
  <div>
    <slot name="filters" :filters="filters" />
    <SearchResults :results="results" :entityType="props.entity" @select="selectItem" />
    <q-pagination v-model="page" :max="totalPages" @update:model-value="searchEntities" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, defineExpose } from "vue";
import searchService from "src/services/SearchService";
import { SearchRequest } from "src/models/SearchRequest";
import SearchResults from "components/Busca/SearchResults.vue";

const props = defineProps<{
  entity: "via" | "colecao";
}>();

const emit = defineEmits<{(event: "select", item: any): void;
  (event: "update-results", results: any[]): void;
}>();

const filters = ref<SearchRequest>({
  searchQuery: "",
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExposure: null,
  page: 1,
  itemsPerPage: 10
});

const results = ref<any[]>([]);
const page = ref(1);
const totalPages = ref(1);

onMounted(() => {
  // Execute a busca inicial
  searchEntities();
});

const searchEntities = async () => {
  try {
    // Monta o searchRequest com o entityType incluído
    const searchRequest: SearchRequest = {
      ...filters.value,
      entityType: props.entity
    };
    const searchResult = await searchService.search(searchRequest);
    results.value = searchResult.items;
    totalPages.value = searchResult.totalPages;
    emit("update-results", results.value);
  } catch (error) {
    console.error("Error searching entities:", error);
  }
};

const handleApplyFilters = (newFilters: SearchRequest) => {
  filters.value = { ...filters.value, ...newFilters };
  searchEntities();
};

defineExpose({ handleApplyFilters });

const selectItem = (item: any) => {
  console.log("Item selecionado:", item);
  emit("select", item);
};
</script>
