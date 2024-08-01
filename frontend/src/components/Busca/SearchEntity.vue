<template>
  <div>
    <div class="search-header">
      <h2>Busca</h2>
    </div>
    <slot name="filters" :filters="filters" />
    <SearchResults :results="results" :entityType="props.entity" @select="selectItem" />
    <q-pagination v-model="filters.page as number" :max="totalPages" @update:model-value="searchEntities" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, defineExpose } from 'vue';
import searchService from 'src/services/SearchService';
import { SearchRequest } from 'src/models/SearchRequest';
import SearchResults from 'components/Busca/SearchResults.vue';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';

const props = defineProps<{
  entity: 'via' | 'colecao';
}>();

const emit = defineEmits<{(event: 'select', item: any): void; (event: 'update-results', results: any[]): void;}>();

const filters = ref<SearchRequest>({
  searchQuery: '',
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExtensionCategory: null,
  selectedCrux: null,
  page: 1,
  itemsPerPage: 10
});

const results = ref<any[]>([]);
const totalPages = ref(1);

onMounted(() => {
  searchEntities();
});

const searchEntities = async () => {
  try {
    const searchRequest: SearchRequest = {
      ...filters.value,
      entityType: props.entity
    };
    const searchResult = await searchService.search(searchRequest);

    // Formatar as entidades do tipo Via
    if (props.entity === 'via') {
      searchResult.items = searchResult.items.map((item: any) => formatVia(item as Via));
    }

    results.value = searchResult.items;
    totalPages.value = searchResult.totalPages;
    console.log('Search results:', results.value);
    emit('update-results', results.value);
  } catch (error) {
    console.error('Error searching entities:', error);
  }
};

const handleApplyFilters = (newFilters: SearchRequest) => {
  filters.value = { ...filters.value, ...newFilters, page: 1 }; // Reset page when filters are updated
  searchEntities();
};

defineExpose({ handleApplyFilters });

const selectItem = (item: any) => {
  console.log('Item selecionado:', item);
  emit('select', item);
};
</script>

<style scoped>
.search-header {
  text-align: center;
  margin-bottom: 16px;
}

.search-header h2 {
  font-size: 24px;
  font-weight: bold;
}
</style>
