<template>
  <div v-if="totalPages > 0" :class="['paginacao-container', `paginacao-${variant}`]">
    <div class="paginacao-content">
      <!-- Itens por página -->
      <div class="items-per-page-control">
        <span class="field-label" v-if="variant !== 'modal'">
          <span class="label-full">Itens por página</span>
          <span class="label-short">Itens/pág</span>
        </span>
        <q-select
          v-model="localItemsPerPage"
          :options="itemsPerPageOptions"
          class="custom-select items-per-page-select"
          dense
          outlined
          @update:model-value="onItemsPerPageChange"
        />
      </div>

      <!-- Paginação com PrimeVue Paginator -->
      <div v-if="totalPages > 1" class="paginator-wrapper">
        <Paginator
          v-model:first="localFirst"
          :rows="localItemsPerPage"
          :totalRecords="totalRecords"
          :pageLinkSize="computedMaxPages"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="custom-pagination"
          :class="`paginator-page-${localCurrentPage}`"
          @page="onPageChange"
          ref="paginatorRef"
        />
      </div>
      <div v-else class="spacer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUpdated } from 'vue';
import Paginator from 'primevue/paginator';

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

// Computed para adaptar conforme o contexto
const maxPages = computed(() => {
  if (props.variant === 'modal') {
    return 3; // Modais menores: menos páginas visíveis
  } else if (props.variant === 'mobile') {
    return 3; // Mobile: menos páginas
  }
  // Desktop (page): 5 páginas visíveis (1, 2, 3, 4, 5, ..., última)
  // O Quasar vai adaptar automaticamente para mobile via CSS
  return 5;
});

const paginationSize = computed(() => {
  if (props.variant === 'modal') {
    return 'xs';
  } else if (props.variant === 'mobile') {
    return 'sm';
  }
  return props.size || 'sm';
});

const emit = defineEmits<{
  'page-change': [page: number];
  'items-per-page-change': [itemsPerPage: number];
}>();

// Refs locais - inicializar com props
const localCurrentPage = ref(props.currentPage || 1);
const localItemsPerPage = ref(props.itemsPerPage || props.itemsPerPageOptions[0]);
const localFirst = ref((props.currentPage - 1) * (props.itemsPerPage || props.itemsPerPageOptions[0]));
const paginatorRef = ref();

// Sincronizar props com refs locais - com immediate para garantir sincronização inicial
watch(() => props.currentPage, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    // Sempre atualizar, mesmo se for o mesmo valor, para garantir sincronização
    localCurrentPage.value = newVal;
    // Atualizar localFirst também
    localFirst.value = (newVal - 1) * localItemsPerPage.value;
  }
}, { immediate: true });

watch(() => localItemsPerPage.value, (newVal) => {
  // Quando itemsPerPage muda, atualizar localFirst
  localFirst.value = (localCurrentPage.value - 1) * newVal;
});

watch(() => props.itemsPerPage, (newVal) => {
  if (newVal !== undefined && newVal !== null && newVal !== localItemsPerPage.value) {
    localItemsPerPage.value = newVal;
  }
}, { immediate: true });

// Computed para max-pages baseado na variante
const computedMaxPages = computed(() => {
  if (props.variant === 'page') {
    return 5; // Desktop: 5 páginas
  } else if (props.variant === 'modal') {
    return 3; // Modais: 3 páginas
  }
  return 3; // Mobile: 3 páginas
});

// Computed para totalRecords (usar totalRecords se fornecido, senão calcular)
const totalRecords = computed(() => {
  if (props.totalRecords && props.totalRecords > 0) {
    return props.totalRecords;
  }
  // Calcular baseado em totalPages * itemsPerPage (fallback)
  return props.totalPages * props.itemsPerPage;
});


// Handlers
const onPageChange = (event: any) => {
  // PrimeVue Paginator retorna um objeto com first, rows, page, pageCount
  const newPage = (event.first / event.rows) + 1;
  
  // Atualizar localmente
  localCurrentPage.value = newPage;
  localFirst.value = event.first;
  
  // Emitir evento de mudança de página
  emit('page-change', newPage);
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  localItemsPerPage.value = newItemsPerPage;
  emit('items-per-page-change', newItemsPerPage);
};

// Função para aplicar highlight manualmente
const applyHighlight = () => {
  nextTick(() => {
    if (!paginatorRef.value) return;
    
    const paginatorEl = paginatorRef.value.$el || paginatorRef.value;
    if (!paginatorEl) return;
    
    // Remover highlight de todos os botões
    const allPages = paginatorEl.querySelectorAll('.p-paginator-page');
    allPages.forEach((page: HTMLElement) => {
      page.classList.remove('p-highlight', 'active-page');
      page.removeAttribute('aria-current');
    });
    
    // Calcular qual botão deve estar ativo
    const currentPageIndex = localCurrentPage.value;
    const pageButtons = Array.from(allPages) as HTMLElement[];
    
    // Encontrar o botão que corresponde à página atual
    pageButtons.forEach((button: HTMLElement) => {
      const buttonText = button.textContent?.trim();
      const buttonPage = parseInt(buttonText || '0', 10);
      
      if (buttonPage === currentPageIndex) {
        button.classList.add('p-highlight', 'active-page');
        button.setAttribute('aria-current', 'page');
      }
    });
  });
};

// Aplicar highlight quando a página mudar
watch(() => localCurrentPage.value, () => {
  applyHighlight();
});

watch(() => localFirst.value, () => {
  applyHighlight();
});

onMounted(() => {
  applyHighlight();
});

onUpdated(() => {
  applyHighlight();
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.paginacao-container {
  margin-top: 48px;
  margin-bottom: 32px;
  padding: 16px;
  background-color: transparent;
  border: 2px solid $cumes-01;
  border-radius: 8px;
  transition: border-color 0.2s ease;
  max-width: 100%;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    margin-top: 32px;
    margin-bottom: 150px; /* Espaço para botões flutuantes (BotaoAdicionar ~100px + altura + NavBar ~80px) */
    padding: 8px;
  }
}

// Variante page - borda mais destacada
.paginacao-page {
  border-color: $cumes-01;
}

.paginacao-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    justify-content: space-between;
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
    font-size: 13px;
    font-weight: 700;
    color: $cumes-03;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    white-space: nowrap;
    opacity: 1;
    
    .label-short {
      display: none;
    }
    
    @media (max-width: 768px) {
      font-size: 9px;
      letter-spacing: 0.3px;
      
      .label-full {
        display: none;
      }
      
      .label-short {
        display: inline;
      }
    }
  }

  .items-per-page-select {
    width: 120px;
    min-width: 120px;
    
    @media (max-width: 768px) {
      width: 65px;
      min-width: 65px;
    }
  }
}

.spacer {
  flex: 1;
}

// Custom Select Styling - Seguindo padrão dos modais
.custom-select {
  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 8px !important;
    padding: 0 !important;
    min-height: 40px !important;
    
    &::before {
      border-color: $cumes-01 !important;
      border-width: 2px !important;
    }
  }

  :deep(.q-field__native) {
    color: $background !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    padding: 10px 14px !important;
    min-height: 40px !important;
  }

  :deep(.q-field__input) {
    color: $background !important;
    padding: 10px 14px !important;
    min-height: 40px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
  }

  :deep(.q-field__label) {
    color: $cumes-03 !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.8px !important;
    font-size: 13px !important;
  }

  :deep(.q-field__append) {
    padding-right: 12px;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
  
  // Menu do dropdown - simples e próximo ao campo
  :deep(.q-menu) {
    background-color: $offwhite !important;
    border: 2px solid $cumes-01 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px $box-shadow-medium !important;
    min-width: 120px !important;
    max-width: 120px !important;
    
    @media (max-width: 768px) {
      min-width: 70px !important;
      max-width: 70px !important;
    }
    
    .q-item {
      color: $background !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      padding: 10px 14px !important;
      min-height: 40px !important;
      
      &:hover {
        background-color: rgba($cumes-01, 0.1) !important;
      }
      
      &.q-item--active {
        background-color: $cumes-01 !important;
        color: $offwhite !important;
        font-weight: 700 !important;
      }
    }
  }
}

// Wrapper do paginator
.paginator-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
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
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  overflow: hidden;

  // Botões de navegação (First, Prev, Next, Last)
  :deep(.p-paginator-prev),
  :deep(.p-paginator-next),
  :deep(.p-paginator-first),
  :deep(.p-paginator-last) {
    color: $cumes-01 !important;
    background-color: transparent !important;
    border: 1px solid rgba($cumes-01, 0.3) !important;
    border-radius: 6px !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    min-width: 33px;
    height: 33px;
    margin: 0 4px;
    
    &:hover:not(:disabled) {
      background-color: rgba($cumes-01, 0.15) !important;
      border-color: rgba($cumes-01, 0.5) !important;
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  // Botões de página (números)
  :deep(.p-paginator-page) {
    color: $cumes-01 !important;
    background-color: transparent !important;
    border: 1px solid rgba($cumes-01, 0.3) !important;
    border-radius: 6px !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    min-width: 33px;
    height: 33px;
    margin: 0 4px;
    transition: all 0.2s ease !important;
  }
  
  // Highlight usando múltiplos seletores para garantir que funcione - mais discreto
  :deep(.p-paginator-page.p-highlight),
  :deep(.p-paginator-page.active-page),
  :deep(.p-paginator-page[aria-current="page"]),
  :deep(.p-paginator-page.p-highlight[aria-current="page"]) {
    background-color: $cumes-01 !important;
    color: $offwhite !important;
    border-color: $cumes-01 !important;
    border-width: 2px !important;
    font-weight: 800 !important;
    font-size: 15px !important;
    box-shadow: 0 2px 8px rgba($cumes-01, 0.4) !important;
    transform: none !important;
    position: relative !important;
    z-index: 1 !important;
    min-width: 35px !important;
    height: 35px !important;
  }

  :deep(.p-paginator-page:hover:not(.p-highlight):not([aria-current="page"])) {
    background-color: rgba($cumes-01, 0.15) !important;
    border-color: rgba($cumes-01, 0.5) !important;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 8px 20px rgba($cumes-01, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow: 0 8px 24px rgba($cumes-01, 1), inset 0 2px 4px rgba(255, 255, 255, 0.3);
    }
  }

}

// Variante page (desktop) - botões maiores
.paginacao-page .custom-pagination {
  :deep(.p-paginator-page) {
    min-width: 54px !important;
    height: 32px !important;
    margin: 0 14px !important;
    padding: 0 16px !important;
    
    &.p-highlight {
      min-width: 58px !important;
      height: 36px !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      border-width: 2px !important;
      border-color: $cumes-01 !important;
      box-shadow: 0 2px 8px rgba($cumes-01, 0.4) !important;
      transform: none !important;
    }
  }
  
  :deep(.p-paginator-prev),
  :deep(.p-paginator-next),
  :deep(.p-paginator-first),
  :deep(.p-paginator-last) {
    min-width: 54px !important;
    height: 32px !important;
    margin: 0 14px !important;
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
  
  .items-per-page-select {
    width: 70px !important;
    min-width: 70px !important;
  }
  
  .paginator-wrapper {
    gap: 4px !important;
    flex-wrap: nowrap !important;
  }
  
  .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 28px !important;
      height: 28px !important;
      margin: 0 2px !important;
      font-size: 12px !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 30px !important;
        height: 30px !important;
        font-size: 13px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 28px !important;
      height: 28px !important;
      margin: 0 2px !important;
      font-size: 12px !important;
    }
  }
}

// Responsividade - Mobile
@media (max-width: 768px) {
  .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 28px !important;
      width: 28px !important;
      height: 28px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 2px !important;
      border-width: 1px !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 30px !important;
        width: 30px !important;
        height: 30px !important;
        font-size: 12px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 28px !important;
      width: 28px !important;
      height: 28px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 2px !important;
      border-width: 1px !important;
    }
  }
  
  .paginacao-page .custom-pagination {
    :deep(.p-paginator-page) {
      min-width: 28px !important;
      width: 28px !important;
      height: 28px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
      padding: 0 2px !important;
      
      &.p-highlight,
      &.active-page {
        min-width: 30px !important;
        width: 30px !important;
        height: 30px !important;
        font-size: 12px !important;
      }
    }
    
    :deep(.p-paginator-prev),
    :deep(.p-paginator-next),
    :deep(.p-paginator-first),
    :deep(.p-paginator-last) {
      min-width: 28px !important;
      width: 28px !important;
      height: 28px !important;
      font-size: 11px !important;
      margin: 0 1px !important;
    }
  }
  
  .paginacao-container {
    padding: 8px;
    margin-top: 24px;
    margin-bottom: 150px; /* Espaço para botões flutuantes */
  }
  
  // Ajustar select no mobile
  .items-per-page-control {
    :deep(.custom-select) {
      :deep(.q-field__control) {
        min-height: 32px !important;
      }
      
      :deep(.q-field__native) {
        font-size: 12px !important;
        padding: 6px 8px !important;
        min-height: 32px !important;
      }
    }
  }
}
</style>

