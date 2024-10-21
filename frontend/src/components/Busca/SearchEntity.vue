<template>
  <div>
    <div class="search-header">
      <div class="text-h2"> Busca</div>
    </div>
    <div class="slot-container">
      <slot name="filters" :filters="filters" />
    </div>
    <SearchResults :results="results" :entityType="props.entity" @select="selectItem" />
  </div>
  <div ref="observer" class="observer-element"></div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps, onMounted, onUnmounted, watch } from 'vue';
import searchService from 'src/services/SearchService';
import SearchResults from 'components/Busca/SearchResults.vue';
import { formatVia } from 'src/utils/utils';
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';
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
  itemsPerPage: 12,
  ...props.staticFilters, // Inicializa os filtros com os filtros estáticos
  ...route.query // Inclui os filtros passados pela rota
});

const results = ref();
const totalPages = ref(1);
const observer = ref<HTMLElement | null>(null); // Elemento observado
let observerInstance: IntersectionObserver | null = null;

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
  searchEntities();
  createObserver(); // Cria o IntersectionObserver
});

onUnmounted(() => {
  if (observerInstance) {
    observerInstance.disconnect(); // Desconecta o observer ao desmontar o componente
  }
});

const createObserver = () => {
  // Cria o IntersectionObserver
  observerInstance = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!filters.value.page) {
      filters.value.page = 1;
    }
    if (entry.isIntersecting && filters.value.page < totalPages.value) {
      filters.value.page++;
      searchEntities(); // Carrega mais resultados
    }
  }, {
    root: null, // Usa o viewport como root
    rootMargin: '0px',
    threshold: 1.0 // Aciona quando 100% do elemento está visível
  });

  // Conecta o observer ao elemento
  if (observer.value) {
    observerInstance.observe(observer.value);
  }
};

const searchEntities = async () => {
  try {
    const searchRequest = { ...filters.value, entityType: props.entity };
    const searchResult = await searchService.search(searchRequest);

    if (filters.value.page === 1) {
      results.value = searchResult.items;
    } else {
      results.value = [...results.value, ...searchResult.items];
    }

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

<style scoped lang="scss">
@import 'src/css/app.scss';
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
  color: $primary;

}

.text-h2 {
  color: $primary;
}

.end-of-list-card {
  margin-top: 16px;
  padding: 16px;
  text-align: center;
  background-color: $dark;
  border: 2px solid $secondary;
  border-radius: 8px;
}

.end-of-list-text {
  font-size: 18px;
  font-weight: bold;
  color: $primary;
}
</style>
