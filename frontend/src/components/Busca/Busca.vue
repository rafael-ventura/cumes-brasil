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
    />
  </div>
  <div ref="observer" class="observer-element"></div>
</template>

<script setup lang="ts">
import { defineEmits, defineExpose, defineProps, onMounted, onUnmounted, ref, watch } from 'vue';
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
}>();

defineOptions({
  name: 'BuscaComponent'
});
const emit = defineEmits(['select', 'update-results']);
const route = useRoute();

const filters = ref(<BuscaRequest>{
  unifiedSearch: '',
  selectedDifficulty: null,
  selectedExtensionCategory: null,
  selectedCrux: null,
  selectedExposicao: null,
  page: 1,
  sortField: 'nome',
  sortOrder: 'asc',
  itemsPerPage: 20,
  ...props.staticFilters,
  ...route.query
});

const results = ref();
const totalItems = ref(0);
const totalPages = ref(1);
const loading = ref(false);
const observer = ref<HTMLElement | null>(null);
const isSorting = ref(false);
let observerInstance: IntersectionObserver | null = null;

onMounted(async () => {
  if (props.initialData && props.initialData.length) {
    results.value = props.initialData;
    emit('update-results', results.value);
  } else {
    searchEntities(true);
  }
  createObserver();
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

onUnmounted(() => {
  if (observerInstance) {
    observerInstance.disconnect();
  }
});

const createObserver = () => {
  observerInstance = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && filters.value.page < totalPages.value && !loading.value) {
      filters.value.page++;
      searchEntities(false);
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
    if (reset) {
      results.value = searchResult.items;
    } else {
      results.value = [...results.value, ...searchResult.items];
    }
    totalPages.value = searchResult.totalPages;
    totalItems.value = searchResult.totalItems;
    emit('update-results', results.value);
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
  color: $primary;
}

.slot-container {
  padding: 16px;
  background-color: $background;
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
  background-color: $background;
  border-radius: 8px;
}

.end-of-list-text {
  font-size: 18px;
  font-weight: bold;
  color: $primary;
}
</style>
