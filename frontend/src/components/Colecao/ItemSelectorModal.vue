<template>
  <q-dialog v-model="isOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="style" size="28px" class="title-icon" />
          <span>{{ title }}</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <ItemSugestao
          :items="items"
          :itemType="itemType"
          @add-item="addItem"
        />
      </q-card-section>

      <q-card-actions align="right" class="card-actions">
        <div class="actions-content">
          <q-select
            v-model="itemsPerPage"
            :options="itemsPerPageOptions"
            class="custom-select items-per-page-select"
            dense
            outlined
            @update:model-value="onItemsPerPageChange"
          />
          <q-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :max="totalPages"
            boundary-numbers
            max-pages="5"
            size="sm"
            class="custom-pagination"
            @update:model-value="onPageChange"
          />
          <div class="spacer" v-if="totalPages <= 1"></div>
          <q-btn 
            label="Fechar" 
            class="btn-secondary-custom"
            v-close-popup
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ItemSugestao from '../ItemSugestao.vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  fetchItems:(page: number, limit: number) => Promise<{ items: any[]; total: number }>;
  addItemToTarget: (itemId: number) => Promise<void>;
  itemType: 'via' | 'colecao';
}>();

const emit = defineEmits(['update:isOpen', 'item-added']);

const isOpen = ref(props.isOpen);
const items = ref<any[]>([]);
const itemsPerPage = ref(6);
const itemsPerPageOptions = ref([6, 10, 20]);
const totalPages = ref(1);
const currentPage = ref(1);

watch(() => props.isOpen, (newVal) => {
  isOpen.value = newVal;
});

watch(isOpen, (newVal) => {
  emit('update:isOpen', newVal);
});

const loadItems = async (page = 1) => {
  try {
    const result = await props.fetchItems(page, itemsPerPage.value);
    items.value = result.items;
    totalPages.value = Math.ceil(result.total / itemsPerPage.value);
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
    items.value = [];
    totalPages.value = 1;
  }
};

const onItemsPerPageChange = async (newLimit: number) => {
  itemsPerPage.value = newLimit;
  currentPage.value = 1;
  await loadItems(1);
};

const onPageChange = async (page: number) => {
  currentPage.value = page;
  await loadItems(page);
};

const addItem = async (item: any) => {
  try {
    await props.addItemToTarget(item.id);
    emit('item-added', item);
    items.value = items.value.filter(i => i.id !== item.id); // Remove o item já adicionado
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
  }
};

const handleHide = () => {
  emit('update:isOpen', false);
};

const onDialogShow = async () => {
  await loadItems();
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.my-card {
  min-width: 320px;
  max-width: 500px;
  width: 92vw;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    width: 600px;
    max-width: 600px;
  }
  
  @media (min-width: 1024px) {
    width: 750px;
    max-width: 750px;
  }
  
  @media (min-width: 1440px) {
    width: 850px;
    max-width: 850px;
  }
}

// Header do Card
.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

// Body do Card
.card-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 600px) {
    padding: 16px;
  }
}

// Card Actions
.card-actions {
  padding: 16px 24px;
  border-top: 1px solid rgba($cumes-03, 0.2);
  background-color: $background;
}

.actions-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: flex-end;
  overflow: hidden;

  @media (max-width: 600px) {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
  }
}

.spacer {
  flex: 1;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  flex-shrink: 0;
  
  @media (max-width: 600px) {
    font-size: 10px;
    letter-spacing: 0.5px;
  }
}

// Custom Select Styling
.custom-select {
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
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  :deep(.q-field__input) {
    color: $background !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
  
  // Menu do dropdown - simples
  :deep(.q-menu) {
    background-color: $offwhite !important;
    border: 2px solid $cumes-01 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px $box-shadow-medium !important;
    min-width: 140px !important;
    max-width: 140px !important;
    
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

.items-per-page-select {
  width: 140px;
  min-width: 140px;
  flex-shrink: 0;
  
  @media (max-width: 600px) {
    width: 60px;
    min-width: 60px;
  }
}

// Custom Pagination
.custom-pagination {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  
  @media (max-width: 600px) {
    flex: 1;
    min-width: 0;
  }

  :deep(.q-btn) {
    color: $cumes-03 !important;
    background-color: transparent !important;
    min-width: 33px;
    height: 33px;
    border: 1px solid rgba($cumes-03, 0.3) !important;
    border-radius: 6px !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    
    &.q-btn--active {
      background-color: $cumes-03 !important;
      color: $offwhite !important;
      border-color: $cumes-03 !important;
      font-weight: 800 !important;
    }

    &:hover:not(.q-btn--active) {
      background-color: rgba($cumes-03, 0.15) !important;
      border-color: rgba($cumes-03, 0.5) !important;
    }
  }

  :deep(.q-pagination__input) {
    color: $cumes-04 !important;
  }
}

// Secondary Button
.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 8px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  min-height: 36px !important;
  white-space: nowrap;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
  }
}

</style>
