<template>
  <div>
    <div class="search-header">
      <div class="text-h2"> Busca</div>
    </div>
    <div class=" slot-container">
      <slot name="filters" :filters="filters" />
    </div>
    <SearchResults :results="results" :entityType="props.entity" @select="selectItem" />
    <q-pagination v-model="filters.page as number" :max="totalPages" @update:model-value="searchEntities" />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineExpose, defineProps, onMounted, ref } from 'vue';
import searchService from 'src/services/SearchService';
import { SearchRequest } from 'src/models/SearchRequest';
import SearchResults from 'components/Busca/SearchResults.vue';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';

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
    if (props.entity === 'via') {
      searchResult.items = searchResult.items.map((item: any) => {
        const via = formatVia(item as Via);
        via.imagem.url = ImagemService.getFullImageUrl(via.imagem.url);
        return via;
      });
    }

    results.value = searchResult.items;
    totalPages.value = searchResult.totalPages;
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
  color: #fcbd7b;
}

.slot-container {
  border: 2px solid #bce9b4; /* Cor da borda */
  padding: 16px; /* Espaçamento interno */
  border-radius: 8px; /* Bordas arredondadas */
  background-color: #2c2c2c; /* Cor de fundo para destacar o conteúdo */
}

.slot-container * {
  color: #fcbd7b;

}

.text-h2 {
  color: #fcbd7b;
}

</style>
