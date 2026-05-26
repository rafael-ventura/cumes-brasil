<template>
  <div>
    <div
      v-if="!hideOrderBar"
      class="order-container"
      :class="{ 'order-container--compacto': compact }"
    >
      <div class="total-results" v-if="totalItems && !ocultarTotalResultados">
        {{ totalItems > 1 ? `${totalItems} resultados` : `${totalItems} resultado` }}
      </div>
      <div class="ordenacao-container" :class="{ 'ordenacao-container--compacto': compact }">
        <span class="ordenacao-label">Ordenar</span>
        <Select
          v-model="ordenacaoAtual"
          :options="opcoesOrdenacaoFiltradas"
          option-label="label"
          option-value="value"
          class="ordenacao-select"
          @change="(evento) => aoMudarOrdenacao(evento.value)"
        />
      </div>
    </div>

    <!-- Skeleton Loading (apenas quando realmente não existe conteúdo ainda) -->
    <div v-if="loading && (!results || results.length === 0)" class="skeleton-container">
      <div v-for="i in itemsPerPage" :key="i" class="skeleton-card">
        <q-skeleton type="rect" height="200px" />
        <q-skeleton type="text" width="80%" class="q-mt-sm" />
        <q-skeleton type="text" width="60%" />
      </div>
    </div>

    <!-- Renderiza ViaCard se entityType for 'via' -->
    <div v-else-if="entityType === 'via' && sortedResults">
      <ViaLista
        :vias="sortedResults as Via[]"
        :modo-selecao="modoSelecaoVias"
        :ids-selecionados="viasSelecionadasIds"
        @toggle-selecao="$emit('toggle-selecao-via', $event)"
      />
    </div>
    <!-- Renderiza ColecaoCard se entityType for 'colecao' -->
    <div v-else-if="entityType === 'colecao' && sortedResults">
      <ColecaoLista
        :colecoes="sortedResults as IColecao[]"
        :exibir-menu="exibirMenuColecao"
        @editar="$emit('editar-colecao', $event)"
        @excluir="$emit('excluir-colecao', $event)"
      />
    </div>
    <div
      v-else-if="entityType === 'escalada' && sortedResults"
      class="escaladas-grid"
      :class="{ 'escaladas-grid--compacto': compact }"
    >
      <EscaladaCard
        v-for="escalada in sortedResults"
        :key="escalada.id"
        :escalada="escalada"
        :modo-selecao="modoSelecaoEscaladas"
        :selecionada="escaladasSelecionadasIds.includes(escalada.id)"
        class="escalada-card-item"
        @toggle-selecao="$emit('toggle-selecao-escalada', escalada.id)"
      />
    </div>
    <!-- Mensagem se não houver resultados -->
    <div v-else-if="!loading && results && results.length === 0">
      <p class="result-not-found"> Nenhum resultado foi encontrado.</p>
    </div>

    <!-- Controles de Paginação -->
    <div class="pagination-wrapper" :class="{ 'pagination-wrapper--compacto': compact }">
      <PaginacaoPadrao
        v-if="totalPages && totalPages > 0 && !hidePagination"
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
import { filtrarOpcoesOrdenacao, type ValorOrdenacao } from 'src/utils/buscaOrdenacao';
import Select from 'primevue/select';

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
  compact: {
    type: Boolean,
    default: false
  },
  hideOrderBar: {
    type: Boolean,
    default: false
  },
  ocultarTotalResultados: {
    type: Boolean,
    default: false
  },
  initialSort: Object,
  enableSortOptions: Array,
  exibirMenuColecao: {
    type: Boolean,
    default: false
  },
  modoSelecaoVias: {
    type: Boolean,
    default: false
  },
  viasSelecionadasIds: {
    type: Array as () => number[],
    default: () => []
  },
  modoSelecaoEscaladas: {
    type: Boolean,
    default: false
  },
  escaladasSelecionadasIds: {
    type: Array as () => number[],
    default: () => []
  }
});

const emit = defineEmits([
  'select',
  'change-sort',
  'page-change',
  'items-per-page-change',
  'editar-colecao',
  'excluir-colecao',
  'toggle-selecao-via',
  'toggle-selecao-escalada'
]);

// Funções de paginação
const onPageChange = (page: number) => {
  emit('page-change', page);
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  emit('items-per-page-change', newItemsPerPage);
};

const opcoesOrdenacaoFiltradas = computed(() =>
  filtrarOpcoesOrdenacao(props.enableSortOptions as { field: string; label: string }[] | undefined)
);

// Ordenação atual (sincroniza com initialSort da URL)
const ordenacaoAtual = ref<ValorOrdenacao | null>(
  props.initialSort ? props.initialSort : opcoesOrdenacaoFiltradas.value[0]?.value
);

watch(
  () => props.initialSort,
  (newSort) => {
    if (newSort && newSort.field && newSort.direction) {
      ordenacaoAtual.value = newSort;
    }
  },
  { immediate: true }
);

// Aplica a ordenação nos resultados
const sortedResults: any = computed(() => {
  if (!props.results || !props.results.length) return [];

  // Copia os resultados para não alterar a prop original
  const resultsCopy = [...props.results];

  if (!ordenacaoAtual.value) return resultsCopy;
  return resultsCopy.sort((a: any, b: any) => {
    const field = ordenacaoAtual.value.field;
    const direction = ordenacaoAtual.value.direction;

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

    // Data da escalada (campo `data` no modelo)
    if (field === 'data') {
      const dateA = new Date(a.data || '');
      const dateB = new Date(b.data || '');
      if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) return 0;
      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    if (field === 'created_at' || field === 'updated_at') {
      const dateA = new Date(a[field] || '');
      const dateB = new Date(b[field] || '');
      if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) return 0;
      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
});

function aoMudarOrdenacao(v: ValorOrdenacao | null) {
  if (!v?.field) return;
  ordenacaoAtual.value = v;
  emit('change-sort', { field: v.field, direction: v.direction });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const selectItem = (item: Via | IColecao | any) => {
  emit('select', item);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.order-container {
  margin-bottom: 16px;
  margin-right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 12px;
}

.order-container--compacto {
  margin-bottom: 8px;
  margin-top: 2px;
  gap: 8px 12px;
  padding: 0 12px;
  align-items: flex-end;
}

.total-results {
  color: $cumes-01;
  font-size: 13px;
  font-weight: 600;
  margin-right: auto;
  margin-left: 0;
  opacity: 0.92;
}

.order-container--compacto .total-results {
  font-size: 12px;
  padding-bottom: 2px;
}

// Ordenação (PrimeVue Select)
.ordenacao-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.ordenacao-container--compacto {
  gap: 6px;
}

.ordenacao-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba($offwhite, 0.6);
}

.ordenacao-select {
  min-width: 170px;
}

:global(.ordenacao-select.p-select) {
  background-color: rgba($background, 0.15) !important;
  border: 1px solid rgba($cumes-01, 0.28) !important;
  border-radius: 12px !important;
  min-height: 34px !important;
  box-shadow: none !important;
  padding: 0 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
}

:global(.ordenacao-select .p-select-label) {
  color: $offwhite !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  line-height: 34px !important;
  padding: 0 !important;
}

:global(.ordenacao-select .p-select-dropdown) {
  width: 18px !important;
  height: 34px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:global(.ordenacao-select .p-select-dropdown-icon) {
  color: rgba($offwhite, 0.9) !important;
  width: 12px !important;
  height: 12px !important;
}

:global(.ordenacao-select .p-select-overlay) {
  background-color: $background !important;
  border: 1px solid rgba($cumes-01, 0.25) !important;
  border-radius: 12px !important;
  overflow: hidden;
}

:global(.ordenacao-select .p-select-option) {
  color: $offwhite !important;
  font-weight: 600 !important;
}

:global(.ordenacao-select .p-select-option:hover) {
  background-color: rgba($cumes-01, 0.12) !important;
}

:global(.ordenacao-select .p-select-option.p-select-option-selected) {
  background-color: rgba($cumes-01, 0.2) !important;
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

.escaladas-grid--compacto {
  gap: 16px;
  padding: 0 12px;
  margin-top: 4px;
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

.pagination-wrapper--compacto {
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 0 12px 0 0;

  :deep(.paginacao-container) {
    margin-top: 6px !important;
    margin-bottom: 8px !important;
  }

  :deep(.paginacao-content) {
    padding: 6px 8px !important;
  }
}
</style>
