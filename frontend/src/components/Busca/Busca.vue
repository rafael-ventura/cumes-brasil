<template>
  <div>
    <div class="q-pt-md search-header" v-if="!hideHeader">
      <div class="text-h4 text-orange-4" v-text="searchHeader != null ? searchHeader : 'Busca'" />
    </div>

    <div v-if="$slots.subHeader">
      <slot name="subHeader" />
    </div>

    <div class="slot-container no-border">
      <slot name="filters" :filters="filters"/>
    </div>
    <BuscaResultados
      :results="results"
      :entityType="props.entity"
      @select="selectItem"
      :enableSortOptions="enableSortOptions"
      @change-sort="updateSorting"
      :totalItems="totalItems"
      :totalPages="totalPages"
      :currentPage="filters.page"
      :itemsPerPage="filters.itemsPerPage || 20"
      :loading="loading"
      :hidePagination="props.hidePagination"
      @page-change="onPageChange"
      @items-per-page-change="onItemsPerPageChange"
    />
    
    <!-- Espaçamento no final -->
    <div class="busca-bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import searchService from 'src/services/SearchService';
import BuscaResultados from 'components/Busca/BuscaResultados.vue';
import { BuscaRequest } from 'src/models/BuscaRequest';
import ImagemService from 'src/services/ImagemService';
import { formatVia } from 'src/utils/utils';
import { useRoute } from 'vue-router';
import { Via } from 'src/models/Via';

const props = defineProps<{
  entity: 'via' | 'colecao' | 'escalada';
  initialData?: any[];
  staticFilters?: Partial<any>
  hideHeader?: boolean
  searchHeader?: string
  enableSortOptions?: { field: string, label: string }[];
  hidePagination?: boolean;
}>();

defineOptions({
  name: 'BuscaComponent'
});
const emit = defineEmits(['select', 'atualizar-results']);
const route = useRoute();

// Carregar itemsPerPage do localStorage ou usar padrão
const getStoredItemsPerPage = (): number => {
  // Para coleções
  if (props.entity === 'colecao') {
    const stored = localStorage.getItem('colecoes_items_per_page');
    if (stored) {
      const value = parseInt(stored, 10);
      if ([9, 10, 25, 50, 100].includes(value)) {
        return value;
      }
    }
    return 9; // padrão para coleções
  }
  
  // Para vias
  const stored = localStorage.getItem('vias_items_per_page');
  if (stored) {
    const value = parseInt(stored, 10);
    if ([10, 25, 50, 100].includes(value)) {
      return value;
    }
  }
  return 20; // padrão para vias
};

// Preparar filtros iniciais, preservando itemsPerPage do localStorage
const initialFilters: BuscaRequest = {
  unifiedSearch: '',
  selectedDifficulty: null,
  selectedExtensionCategory: null,
  selectedCrux: null,
  selectedExposicao: null,
  page: 1,
  sortField: null,
  sortOrder: null,
  itemsPerPage: getStoredItemsPerPage(),
  ...props.staticFilters,
  ...route.query
};

// Se itemsPerPage vier da query string, usar ele; senão manter do localStorage
if (route.query.itemsPerPage) {
  const queryItemsPerPage = parseInt(route.query.itemsPerPage as string, 10);
  if ([10, 25, 50, 100].includes(queryItemsPerPage)) {
    initialFilters.itemsPerPage = queryItemsPerPage;
  }
}

const filters = ref(initialFilters);

const results = ref();
const totalItems = ref(0);
const totalPages = ref(1);
const loading = ref(false);
const isSorting = ref(false);

onMounted(async () => {
  if (props.initialData && props.initialData.length) {
    results.value = props.initialData;
    emit('atualizar-results', results.value);
  } else {
    searchEntities(true);
  }
});

// Função para atualizar a ordenação ao receber uma mudança
const updateSorting = (sortOption: any) => {
  isSorting.value = true; // Indica que estamos alterando a ordenação
  filters.value = {
    ...filters.value,
    page: 1, // Reiniciar a página ao aplicar nova ordenação
    sortField: sortOption.field,
    sortOrder: sortOption.direction
  };
  searchEntities(true); // Realiza a busca com a nova ordenação
};

watch(
  () => filters.value,
  (newFilters, oldFilters) => {
    if (newFilters.page === 1 && JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
      searchEntities(true);
    }
  },
  { deep: true }
);

// Handlers para paginação
const onPageChange = (page: number) => {
  // Atualizar o filtro imediatamente
  filters.value.page = page;
  // Fazer a busca
  searchEntities(true);
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  filters.value.itemsPerPage = newItemsPerPage;
  filters.value.page = 1; // Resetar para primeira página
  // Salvar no localStorage com chave específica para cada tipo de entidade
  if (props.entity === 'colecao') {
    localStorage.setItem('colecoes_items_per_page', newItemsPerPage.toString());
  } else {
    localStorage.setItem('vias_items_per_page', newItemsPerPage.toString());
  }
  searchEntities(true);
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
        if (via.imagem?.url) {
          via.imagem.url = ImagemService.getFullImageUrl(via.imagem.url);
        }
        return via;
      });
    }
    // Sempre substituir resultados ao invés de acumular (paginação tradicional)
    results.value = searchResult.items;
    totalPages.value = searchResult.totalPages || 1;
    totalItems.value = searchResult.totalItems || 0;
    emit('atualizar-results', results.value);
  } catch (error) {
    console.error('Erro ao buscar entidades:', error);
  } finally {
    loading.value = false;
    isSorting.value = false; // Redefine o sinalizador após concluir a ordenação
  }
};

const handleApplyFilters = (newFilters: BuscaRequest) => {
  filters.value = {
    ...filters.value,
    ...props.staticFilters,
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
  color: $cumes-03;
}

.slot-container {
  padding: 16px;
  background-color: $background;
}

.slot-container * {
  color: $cumes-03;
}

.text-h2 {
  color: $cumes-03;
}

.end-of-list-card {
  margin-top: 16px;
  padding: 16px;
  text-align: center;
  background-color: $background;
  border-radius: 8px;
}

.end-of-list-text {
  font-size: 18px;
  font-weight: bold;
  color: $cumes-03;
}

.busca-bottom-spacer {
  height: 48px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 32px;
  }
}
</style>
