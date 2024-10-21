<template>
  <div>
    <div class="search-header">
      <div class="text-h2"> Busca</div>
    </div>
    <div class="slot-container">
      <slot name="filters" :filters="filters" />
    </div>
    <SearchResults :results="results" :entityType="props.entity" @select="selectItem" />
    <q-pagination v-model="filters.page as number" :max="totalPages" @update:model-value="searchEntities" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps, onMounted, watch } from 'vue';
import searchService from 'src/services/SearchService';
import SearchResults from 'components/Busca/SearchResults.vue';
import { SearchRequest } from 'src/models/SearchRequest';
import { useRoute } from 'vue-router';

const props = defineProps<{
  entity: 'via' | 'colecao';
  initialData?: any[]; // Novo parâmetro para dados iniciais
  staticFilters?: Partial<any> // Adicionando a prop para filtros estáticos
}>();

const emit = defineEmits(['select', 'update-results']);
const route = useRoute(); // Captura a rota atual

const filters = ref(<SearchRequest>{
  unifiedSearch: '', // Campo unificado de busca
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExtensionCategory: null,
  selectedCrux: null,
  selectedExposicao: null,
  page: 1,
  itemsPerPage: 10,
  ...props.staticFilters, // Inicializa os filtros com os filtros estáticos
  ...route.query // Inclui os filtros passados pela rota
});

const results = ref();
const totalPages = ref(1);

// Inicializa com initialData ou faz a busca inicial
onMounted(() => {
  // Verifica se há filtros passados pela rota (query)
  if (route.query) {
    console.log('Filtros passados pela rota:', route.query);
    Object.assign(filters.value, route.query);
  }

  if (props.initialData && props.initialData.length) {
    results.value = props.initialData;
    emit('update-results', results.value);
  } else {
    searchEntities();
  }
});

// Observa a mudança no initialData e atualiza os resultados
watch(() => props.initialData, (newData) => {
  if (newData && newData.length) {
    results.value = newData;
    emit('update-results', results.value);
  }
});

const searchEntities = async () => {
  try {
    const searchRequest = { ...filters.value, entityType: props.entity };
    const searchResult = await searchService.search(searchRequest);

    results.value = searchResult.items;
    totalPages.value = searchResult.totalPages;

    emit('update-results', results.value);
  } catch (error) {
    console.error('Erro ao buscar entidades:', error);
  }
};

const handleApplyFilters = (newFilters: SearchRequest) => {
  console.log('filtros static:', props.staticFilters);
  filters.value = {
    ...filters.value, // Mantém os filtros atuais
    ...props.staticFilters, // Garante que os filtros estáticos sejam incluídos
    ...newFilters,
    page: 1
  };
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

.slot-container {
  padding: 16px;
  border-radius: 8px;
  background-color: #2c2c2c;
}
</style>
