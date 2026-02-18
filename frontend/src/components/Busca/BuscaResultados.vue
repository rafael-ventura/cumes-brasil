<template>
  <div>
    <div class="order-container">
      <div class="total-results" v-if="totalItems">
        {{ totalItems > 1 ? `${totalItems} resultados` : `${totalItems} resultado` }}
      </div>
      <q-select
        v-model="currentSortOption"
        :options="filteredSortOptions"
        option-value="value"
        option-label="label"
        label="Ordenar por"
        label-color="secondary"
        class="q-select-custom custom-select"
        outlined
        dense
        map-options
        @update:model-value="changeSorting"
      />
    </div>

    <!-- Skeleton Loading -->
    <div v-if="loading" class="skeleton-container">
      <div v-for="i in itemsPerPage" :key="i" class="skeleton-card">
        <q-skeleton type="rect" height="200px" />
        <q-skeleton type="text" width="80%" class="q-mt-sm" />
        <q-skeleton type="text" width="60%" />
      </div>
    </div>

    <!-- Renderiza ViaCard se entityType for 'via' -->
    <div v-else-if="entityType === 'via' && sortedResults">
      <ViaLista :vias="sortedResults as Via[]" />
    </div>
    <!-- Renderiza ColecaoCard se entityType for 'colecao' -->
    <div v-else-if="entityType === 'colecao' && sortedResults">
      <ColecaoLista :colecoes="sortedResults as IColecao[]" />
    </div>
    <div v-else-if="entityType === 'escalada' && sortedResults" class="escaladas-grid">
      <EscaladaCard
        v-for="escalada in sortedResults"
        :key="escalada.id"
        :escalada="escalada"
        class="escalada-card-item"
      />
    </div>
    <!-- Mensagem se não houver resultados -->
    <div v-else-if="!loading && results && results.length === 0">
      <p class="result-not-found"> Nenhum resultado foi encontrado.</p>
    </div>

    <!-- Controles de Paginação -->
    <div class="pagination-wrapper">
      <PaginacaoPadrao
        v-if="!loading && totalPages && totalPages > 0 && !hidePagination"
        :current-page="currentPage || 1"
        :total-pages="totalPages"
        :items-per-page="itemsPerPage || 20"
        :items-per-page-options="entityType === 'colecao' ? [9, 10, 25, 50, 100] : [10, 25, 50, 100]"
        :total-records="totalItems || 0"
        variant="page"
        @page-change="onPageChange"
        @items-per-page-change="onItemsPerPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ViaLista from 'components/Via/ViaLista.vue';
import ColecaoLista from 'components/Colecao/ColecaoLista.vue';
import { Via } from 'src/models/Via';
import { IColecao } from 'src/models/IColecao';
import EscaladaCard from 'components/Escalada/EscaladaCard.vue';
import PaginacaoPadrao from 'components/PaginacaoPadrao.vue';

// Use defineProps without the type argument
const props = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  entityType: {
    type: String,
    required: true
  },
  totalItems: Number,
  totalPages: {
    type: Number,
    default: 1
  },
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 20
  },
  loading: {
    type: Boolean,
    default: false
  },
  hidePagination: {
    type: Boolean,
    default: false
  },
  initialSort: Object,
  enableSortOptions: Array
});

const emit = defineEmits(['select', 'change-sort', 'page-change', 'items-per-page-change']);

// Funções de paginação
const onPageChange = (page: number) => {
  emit('page-change', page);
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  emit('items-per-page-change', newItemsPerPage);
};

// Opções padrão de ordenação
const defaultSortOptions = ref([
  { label: 'Nome (A-Z)', value: { field: 'nome', direction: 'asc' } },
  { label: 'Nome (Z-A)', value: { field: 'nome', direction: 'desc' } },
  { label: 'Mais recente', value: { field: 'created_at', direction: 'desc' } },
  { label: 'Mais antiga', value: { field: 'created_at', direction: 'asc' } },
  { label: 'Última modificação', value: { field: 'updated_at', direction: 'desc' } }
]);

// Filtrar as opções de ordenação com base na configuração do componente pai
const filteredSortOptions = computed(() => {
  if (!props.enableSortOptions) {
    // Se não houver configuração de opções, usar todas as opções padrão
    return defaultSortOptions.value;
  }

  // Filtrar as opções com base nas permitidas pelo componente pai
  return defaultSortOptions.value.filter(option => props.enableSortOptions?.some((sortOption: any) => sortOption.field === option.value.field));
});

// Ordenação atual (sincroniza com initialSort da URL)
const currentSortOption = ref(
  props.initialSort ? props.initialSort : filteredSortOptions.value[0]?.value
);

watch(
  () => props.initialSort,
  (newSort) => {
    if (newSort && newSort.field && newSort.direction) {
      currentSortOption.value = newSort;
    }
  },
  { immediate: true }
);

// Aplica a ordenação nos resultados
const sortedResults: any = computed(() => {
  if (!props.results || !props.results.length) return [];

  // Copia os resultados para não alterar a prop original
  const resultsCopy = [...props.results];

  if (!currentSortOption.value) return resultsCopy;
  return resultsCopy.sort((a: any, b: any) => {
    const field = currentSortOption.value.field;
    const direction = currentSortOption.value.direction;

    // Ordenação por nome
    if (field === 'nome' && a.nome && b.nome) {
      return direction === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }

    // Ordenação por data de adição
    if (field === 'data_adicao') {
      const dateA = new Date(a.data_adicao || '');
      const dateB = new Date(b.data_adicao || '');

      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
});

// Atualiza a ordenação quando o usuário muda a opção de ordenação
const changeSorting = (sortOption: any) => {
  currentSortOption.value = sortOption.value;
  emit('change-sort', { field: sortOption.value.field, direction: sortOption.value.direction });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const selectItem = (item: Via | IColecao | any) => {
  emit('select', item);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.order-container {
  margin-bottom: 16px;
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.total-results {
  color: $cumes-03;
  font-size: 14px;
  font-weight: 600;
  margin-right: auto;
  margin-left: 16px;
}

.custom-select {
  width: 40%;
  min-width: 200px;

  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 8px !important;
    padding: 0 !important;
    
    &::before {
      border-color: $cumes-01 !important;
      border-width: 2px !important;
    }
  }

  :deep(.q-field__native) {
    color: $background !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 8px 14px !important;
  }

  :deep(.q-field__input) {
    color: $background !important;
    padding: 8px 14px !important;
  }

  :deep(.q-field__label) {
    color: $cumes-03 !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.8px !important;
    font-size: 13px !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

.via-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.escaladas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); /* Cards mais largos no desktop */
  gap: 24px;
  width: 100%;
  padding: 0 16px;
  max-width: 1400px; /* Limita largura máxima para não ficar muito esticado */
  margin: 0 auto; /* Centraliza o grid */
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Um card por vez no mobile */
    gap: 16px;
    padding: 0 5%; /* 5% de padding em cada lado = 90% de largura efetiva */
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
  }
}

.escalada-card-item {
  width: 100%;
  margin: 0;
}

.result-not-found {
  padding-left: 3rem;
  font-size: 1.4rem;
  align-self: center;
  color: $cumes-03;
  font-weight: 600;
}

.skeleton-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

.skeleton-card {
  background: $offwhite;
  border-radius: 8px;
  padding: 16px;
}

.pagination-wrapper {
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 0 16px;
  
  @media (max-width: 768px) {
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 0 8px;
  }
}
</style>
