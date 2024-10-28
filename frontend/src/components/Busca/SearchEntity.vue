<template>
  <div>
    <div class="q-pt-md search-header" v-if="!hideHeader">
      <div class="text-h4 text-orange-4" v-text="searchHeader != null ? searchHeader : 'Busca'" />
    </div>
    <div class="slot-container no-border">
      <slot name="filters" :filters="filters"/>
    </div>
    <SearchResults
      :results="results"
      :entityType="props.entity"
      @select="selectItem"
      :enableSortOptions="enableSortOptions"
    />
  </div>
  <div ref="observer" class="observer-element"></div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps, onMounted, onUnmounted, watch } from 'vue';
import searchService from 'src/services/SearchService';
import SearchResults from 'components/Busca/SearchResults.vue';
import { SearchRequest } from 'src/models/SearchRequest';
import ImagemService from 'src/services/ImagemService';
import { formatVia } from 'src/utils/utils';
import { useRoute } from 'vue-router';
import { Via } from 'src/models/Via';

const props = defineProps<{
  entity: 'via' | 'colecao';
  initialData?: any[]; // Novo parâmetro para dados iniciais
  staticFilters?: Partial<any>
  hideHeader?: boolean
  searchHeader?: string
  enableSortOptions?: { field: string, label: string }[];
}>();

const emit = defineEmits(['select', 'update-results']);
const route = useRoute();

const filters = ref(<SearchRequest>{
  unifiedSearch: '', // Campo unificado de busca
  selectedDifficulty: null,
  selectedExtensionCategory: null,
  selectedCrux: null,
  selectedExposicao: null,
  page: 1,
  itemsPerPage: 20,
  ...props.staticFilters, // Inicializa os filtros com os filtros estáticos
  ...route.query // Inclui os filtros passados pela rota
});

const results = ref();
const totalPages = ref(1);
const loading = ref(false);
const observer = ref<HTMLElement | null>(null);
let observerInstance: IntersectionObserver | null = null;

onMounted(() => {
  // Verifica se há filtros passados pela rota (query)
  if (route.query) {
    Object.assign(filters.value, route.query);
  }

  if (props.initialData && props.initialData.length) {
    results.value = props.initialData;
    emit('update-results', results.value);
  } else {
    searchEntities(true);
  }
  createObserver();
});

watch(
  () => filters.value,
  (newFilters, oldFilters) => {
    if (newFilters.page === 1 && JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
      searchEntities(true);
    }
  },
  { deep: true }
);

onUnmounted(() => {
  if (observerInstance) {
    observerInstance.disconnect(); // Desconecta o observer ao desmontar o componente
  }
});

const createObserver = () => {
  observerInstance = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && filters.value.page < totalPages.value && !loading.value) {
      filters.value.page++;
      searchEntities(false); // Passa 'false' para não resetar resultados
    }
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  });

  if (observer.value) {
    observerInstance.observe(observer.value);
  }
};

const searchEntities = async (reset = false) => {
  if (loading.value) return;
  loading.value = true;

  try {
    const searchRequest = {
      ...filters.value,
      ...props.staticFilters,
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

    if (props.entity === 'colecao') {
      searchResult.items = searchResult.items.map((item: any) => {
        item.imagem.url = ImagemService.getFullImageUrl(item.imagem.url);
        return item;
      });
    }

    if (reset) {
      results.value = searchResult.items;
    } else {
      results.value = [...results.value, ...searchResult.items];
    }

    totalPages.value = searchResult.totalPages;
    emit('update-results', results.value);
  } catch (error) {
    console.error('Erro ao buscar entidades:', error);
  } finally {
    loading.value = false;
  }
};

const handleApplyFilters = (newFilters: SearchRequest) => {
  filters.value = {
    ...filters.value, // Mantém os filtros atuais
    ...props.staticFilters, // Garante que os filtros estáticos sejam incluídos
    ...newFilters,
    page: 1
  };
  searchEntities(true);
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
