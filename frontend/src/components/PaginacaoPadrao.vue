<template>
  <div v-if="totalPages > 0" :class="['paginacao-container', `paginacao-${variant}`]">
    <div class="paginacao-content">
      <!-- Itens por página -->
      <div class="items-per-page-control">
        <span class="field-label" v-if="variant !== 'modal'">
          <span class="label-full">Itens por página</span>
          <span class="label-short">Itens/pág</span>
        </span>
        <Dropdown
          v-model="localItensPorPagina"
          :options="opcoesItensPorPagina"
          option-label="label"
          option-value="value"
          class="itens-por-pagina-dropdown"
          @change="(evento) => aoMudarItensPorPagina(Number(evento.value))"
        />
      </div>

      <!-- Paginação com PrimeVue Paginator -->
      <div v-if="totalPages > 1" class="paginator-wrapper">
        <Paginator
          v-model:first="localIndicePrimeiraPagina"
          :rows="localItensPorPagina"
          :totalRecords="totalRegistros"
          :pageLinkSize="numeroMaximoDeLinksDePagina"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="custom-pagination"
          :class="`paginator-page-${localPaginaAtual}`"
          @page="aoMudarPagina"
        />
      </div>
      <div v-else class="spacer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';

const props = withDefaults(defineProps<{
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  totalRecords?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'modal' | 'page' | 'mobile';
}>(), {
  itemsPerPageOptions: () => [10, 25, 50, 100],
  totalRecords: 0,
  size: 'sm',
  variant: 'page'
});

const emit = defineEmits<{
  'page-change': [page: number];
  'items-per-page-change': [itemsPerPage: number];
}>();

// Refs locais - inicializar com props
const localPaginaAtual = ref(props.currentPage || 1);
const localItensPorPagina = ref(props.itemsPerPage || props.itemsPerPageOptions[0]);
const localIndicePrimeiraPagina = ref((props.currentPage - 1) * (props.itemsPerPage || props.itemsPerPageOptions[0]));
const paginaEmitidaUltima = ref(props.currentPage || 1);

const opcoesItensPorPagina = computed(() => {
  return (props.itemsPerPageOptions || []).map((valor) => ({
    label: `${valor}`,
    value: valor
  }));
});

// Sincronizar props com refs locais - com immediate para garantir sincronização inicial
watch(() => props.currentPage, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    // Sempre atualizar, mesmo se for o mesmo valor, para garantir sincronização
    localPaginaAtual.value = newVal;
    paginaEmitidaUltima.value = newVal;
    // Atualizar localFirst também
    localIndicePrimeiraPagina.value = (newVal - 1) * localItensPorPagina.value;
  }
}, { immediate: true });

watch(() => localItensPorPagina.value, (newVal) => {
  // Quando itemsPerPage muda, atualizar localFirst
  localIndicePrimeiraPagina.value = (localPaginaAtual.value - 1) * newVal;
});

watch(() => props.itemsPerPage, (newVal) => {
  if (newVal !== undefined && newVal !== null && newVal !== localItensPorPagina.value) {
    localItensPorPagina.value = newVal;
  }
}, { immediate: true });

// Computed para max-pages baseado na variante
const numeroMaximoDeLinksDePagina = computed(() => {
  if (props.variant === 'page') {
    return 5; // Desktop: 5 páginas
  } else if (props.variant === 'modal') {
    return 3; // Modais: 3 páginas
  }
  return 3; // Mobile: 3 páginas
});

// Computed para totalRecords (usar totalRecords se fornecido, senão calcular)
const totalRegistros = computed(() => {
  if (props.totalRecords && props.totalRecords > 0) {
    return props.totalRecords;
  }
  // Calcular baseado em totalPages * itemsPerPage (fallback)
  return props.totalPages * props.itemsPerPage;
});


// Handlers
const aoMudarPagina = (event: any) => {
  // PrimeVue Paginator retorna um objeto com first, rows, page, pageCount
  const pageIndex =
    typeof event.page === 'number'
      ? event.page
      : Math.floor(event.first / event.rows);
  const newPage = pageIndex + 1;

  // Evita disparar a mesma página duas vezes (o PrimeVue pode emitir em sequência rápida).
  if (newPage === paginaEmitidaUltima.value) return;
  paginaEmitidaUltima.value = newPage;

  localPaginaAtual.value = newPage;
  localIndicePrimeiraPagina.value = event.first;
  
  // Emitir evento de mudança de página
  emit('page-change', newPage);
};

const aoMudarItensPorPagina = (newItemsPorPagina: number) => {
  if (newItemsPorPagina !== localItensPorPagina.value) {
    localItensPorPagina.value = newItemsPorPagina;
  }
  // Ao mudar a quantidade por página, voltamos para a primeira página visualmente.
  localPaginaAtual.value = 1;
  localIndicePrimeiraPagina.value = 0;
  emit('items-per-page-change', newItemsPorPagina);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.paginacao-container {
  margin-top: 28px;
  margin-bottom: 24px;
  padding: 0;
  background-color: transparent;
  border: none;
  transition: none;
  max-width: 100%;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    margin-top: 20px;
    margin-bottom: 150px; /* Espaço para botões flutuantes (BotaoAdicionar ~100px + altura + NavBar ~80px) */
  }
}

.paginacao-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 12px;
  border-radius: 16px;
  background-color: transparent;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 8px 8px;
  }
}

.items-per-page-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  white-space: nowrap;

  @media (max-width: 768px) {
    gap: 4px;
    flex-shrink: 0;
  }

  .field-label {
    font-size: 11px;
    font-weight: 700;
    color: $cumes-03;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    white-space: nowrap;
    opacity: 1;
    
    .label-short {
      display: none;
    }
    
    @media (max-width: 768px) {
      font-size: 9px;
      letter-spacing: 0.35px;
      
      .label-full {
        display: none;
      }
      
      .label-short {
        display: inline;
      }
    }
  }

  .itens-por-pagina-dropdown {
    width: 64px;
    min-width: 64px;
    
    @media (max-width: 768px) {
      width: 46px;
      min-width: 46px;
    }
  }
}

.spacer {
  flex: 1;
}

// Dropdown (PrimeVue v4 Select) - sem fundo branco (tema escuro do projeto)
// Obs: `Dropdown` estende `Select` no PrimeVue v4 (classes: p-select, p-select-label, p-select-dropdown...)
:global(.itens-por-pagina-dropdown.p-select) {
  background-color: rgba($background, 0.15) !important;
  border: 1px solid rgba($cumes-03, 0.45) !important;
  border-radius: 999px !important;
  min-height: 26px !important;
  box-shadow: none !important;
  padding: 0 8px 0 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0 !important;
}

:global(.itens-por-pagina-dropdown .p-select-label) {
  color: $offwhite !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 26px !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
  display: flex !important;
  align-items: center !important;
}

:global(.itens-por-pagina-dropdown .p-select-dropdown) {
  color: rgba($offwhite, 0.9) !important;
  background: transparent !important;
  width: 18px !important;
  height: 100% !important;
  border-left: none !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 auto !important;
  margin-left: 0 !important;
}

:global(.itens-por-pagina-dropdown .p-select-dropdown-icon) {
  color: $offwhite !important;
}

:global(.itens-por-pagina-dropdown .p-select-dropdown-icon),
:global(.itens-por-pagina-dropdown .p-select-dropdown svg) {
  width: 12px !important;
  height: 12px !important;
}

:global(.itens-por-pagina-dropdown .p-select-overlay) {
  background-color: $background !important;
  border: 1px solid rgba($cumes-03, 0.35) !important;
  border-radius: 12px !important;
  overflow: hidden;
  padding: 4px 0;
}

:global(.itens-por-pagina-dropdown .p-select-list) {
  padding: 0;
}

:global(.itens-por-pagina-dropdown .p-select-option) {
  color: $offwhite !important;
  font-weight: 600 !important;

  &:hover {
    background-color: rgba($cumes-03, 0.15) !important;
  }
}

:global(.itens-por-pagina-dropdown .p-select-option.p-select-option-selected) {
  background-color: rgba($cumes-03, 0.25) !important;
  color: $offwhite !important;
}

// Wrapper do paginator
.paginator-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: nowrap;
  min-width: 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    gap: 2px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
}

// Custom Pagination - PrimeVue Paginator
.custom-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  background-color: transparent;
  border: none;
  border-radius: 12px;
  padding: 0;
  gap: 4px;

  // Garante que as setas/ícones fiquem brancas
  :deep(.p-button-icon),
  :deep(.pi) {
    color: $offwhite !important;
  }

  // Botões de navegação (First, Prev, Next, Last)
  :deep(.p-paginator-prev),
  :deep(.p-paginator-next),
  :deep(.p-paginator-first),
  :deep(.p-paginator-last) {
    color: rgba($offwhite, 0.95) !important;
    background-color: transparent !important;
    border: 1px solid rgba($cumes-03, 0.35) !important;
    border-radius: 10px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    min-width: 32px;
    height: 32px;
    margin: 0 3px;
    
    &:hover:not(:disabled) {
      background-color: rgba($cumes-03, 0.12) !important;
      border-color: rgba($cumes-03, 0.7) !important;
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  // Botões de página (números)
  :deep(.p-paginator-page) {
    color: rgba($offwhite, 0.95) !important;
    background-color: transparent !important;
    border: 1px solid rgba($cumes-03, 0.35) !important;
    border-radius: 10px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    min-width: 32px;
    height: 32px;
    margin: 0 3px;
    transition: transform 0.1s ease, background-color 0.15s ease !important;
  }
  
  // Highlight usando múltiplos seletores para garantir que funcione - mais discreto
  :deep(.p-paginator-page.p-highlight),
  :deep(.p-paginator-page.active-page),
  :deep(.p-paginator-page[aria-current="page"]),
  :deep(.p-paginator-page.p-highlight[aria-current="page"]) {
    background-color: $cumes-03 !important;
    color: $offwhite !important;
    border: 1px solid rgba($cumes-03, 1) !important;
    font-weight: 900 !important;
    font-size: 14px !important;
    box-shadow: none !important;
    transform: none !important;
    position: relative !important;
    z-index: 1 !important;
    min-width: 36px !important;
    height: 36px !important;
  }

  :deep(.p-paginator-page:hover:not(.p-highlight):not([aria-current="page"])) {
    background-color: rgba($cumes-03, 0.12) !important;
    border-color: rgba($cumes-03, 0.7) !important;
  }

}

// Variante page (desktop) - botões maiores
.paginacao-page .custom-pagination {
  :deep(.p-paginator-page) {
    min-width: 32px !important;
    height: 32px !important;
    margin: 0 2px !important;
    padding: 0 0 !important;
    
    &.p-highlight {
      min-width: 32px !important;
      height: 32px !important;
      font-size: 12px !important;
      font-weight: 900 !important;
      border: 1px solid rgba($cumes-03, 1) !important;
      box-shadow: none !important;
      transform: none !important;
    }
  }
  
  :deep(.p-paginator-prev),
  :deep(.p-paginator-next),
  :deep(.p-paginator-first),
  :deep(.p-paginator-last) {
    min-width: 32px !important;
    height: 32px !important;
    margin: 0 2px !important;
  }
}

// Variante modal - botões menores e tudo numa linha
.paginacao-modal {
  .paginacao-content {
    flex-wrap: nowrap !important;
    gap: 8px !important;
  }
  
  .items-per-page-control {
    gap: 0 !important;
    flex-shrink: 0;
    
    // Sem label na modal, só o select
    .field-label {
      display: none !important;
    }
  }
  
  .itens-por-pagina-dropdown {
    width: 60px !important;
    min-width: 60px !important;
  }
  
  .paginator-wrapper {
    gap: 4px !important;
    flex-wrap: nowrap !important;
  }
  
  .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 30px !important;
      height: 30px !important;
      margin: 0 2px !important;
      font-size: 12px !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 32px !important;
        height: 32px !important;
        font-size: 13px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 30px !important;
      height: 30px !important;
      margin: 0 2px !important;
      font-size: 12px !important;
    }
  }
}

// Responsividade - Mobile
@media (max-width: 768px) {
  .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 30px !important;
      width: 30px !important;
      height: 30px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 32px !important;
        width: 32px !important;
        height: 32px !important;
        font-size: 12px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 30px !important;
      width: 30px !important;
      height: 30px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 !important;
    }
  }
  
  .paginacao-page .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 30px !important;
      width: 30px !important;
      height: 30px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 32px !important;
        width: 32px !important;
        height: 32px !important;
        font-size: 12px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 30px !important;
      width: 30px !important;
      height: 30px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
    }
  }
  
  .paginacao-container {
    margin-top: 24px;
    margin-bottom: 150px; /* Espaço para botões flutuantes */
  }
  
  .itens-por-pagina-dropdown {
    :deep(.p-select) {
      min-height: 30px !important;
    }

    :deep(.p-select-label) {
      line-height: 30px !important;
    }
  }
}
</style>

