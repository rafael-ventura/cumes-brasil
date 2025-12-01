<template>
  <q-dialog v-model="isOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="favorite" size="28px" class="title-icon" />
          <span>Escolher Via Preferida</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <!-- Campo de busca -->
        <div class="form-field">
          <label class="field-label">Buscar por nome ou montanha</label>
          <q-input
            v-model="unifiedSearch"
            outlined
            debounce="300"
            class="custom-input search-input"
            dense
            @input="onSearchChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

      <q-list class="vias-list">
        <q-item
          v-for="via in vias"
          :key="via.id"
          clickable
          @click="addVia(via)"
          class="via-item"
          :class="{ 'via-selected': via.selected }"
        >
          <q-item-section avatar>
            <q-avatar square size="60px" class="custom-avatar">
              <q-img :src="getViaImageUrlFull(via) || 'https://via.placeholder.com/60'" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="via-nome">{{ via.nome }}</q-item-label>
            <q-item-label caption class="via-localizacao" v-if="via.localizacao">
              <q-icon name="location_on" size="14px" />
              <span v-if="via.localizacao.estado">{{ via.localizacao.estado.sigla }}</span>
              <span v-if="via.localizacao.cidade">, {{ via.localizacao.cidade.nome }}</span>
              <span v-if="via.localizacao.bairro">, {{ via.localizacao.bairro.nome }}</span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              :icon="via.selected ? 'check_circle' : 'add_circle'"
              :class="via.selected ? 'btn-selected' : 'btn-add'"
              @click.stop="selectedVia(via)"
              :disabled="via.selected"
              size="md"
            />
          </q-item-section>
        </q-item>
        <q-item v-if="!vias.length" class="empty-state">
          <q-item-section class="text-center">
            <q-icon name="search_off" size="48px" color="grey-6" />
            <q-item-label class="empty-text">Nenhuma via encontrada</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

      <q-card-actions align="right" class="card-actions">
        <div class="actions-content">
          <div class="field-label">Itens por página</div>
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
import { ref, watch, computed } from 'vue';
import { Via } from 'src/models/Via';
import ViaService from 'src/services/ViaService';

const props = defineProps<{
  viaPreferidaId: string;
  modelValue?: boolean;
}>();
const emit = defineEmits(['viaPreferidaUpdate', 'update:modelValue']);

const isOpen = ref(props.modelValue || false);

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal || false;
});

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});
const vias = ref<Via[]>([]);
const unifiedSearch = ref('');
const itemsPerPage = ref(6);
const itemsPerPageOptions = ref([6, 10, 20]);
const totalPages = ref(1);
const currentPage = ref(1);
const loading = ref(false);

// Filtragem local das vias
const filteredVias = computed(() => {
  const query = unifiedSearch.value.trim().toLowerCase();
  if (query) {
    return vias.value.filter(via =>
      via.nome.toLowerCase().includes(query) ||
      (via.montanha?.nome && via.montanha.nome.toLowerCase().includes(query)) ||
      (via.montanha?.bairro && via.montanha.bairro.toLowerCase().includes(query))
    );
  }
  return vias.value;
});

const loadVias = async (page = 1) => {
  try {
    loading.value = true;
    const result = await ViaService.getAllVias(page, itemsPerPage.value);
    if (result && result.vias) {
      vias.value = result.vias;
      totalPages.value = Math.ceil(result.total / itemsPerPage.value);
    }
  } catch (error) {
    console.error('Erro ao carregar vias:', error);
    vias.value = [];
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

const onItemsPerPageChange = async (newLimit: number) => {
  itemsPerPage.value = newLimit;
  currentPage.value = 1;
  await loadVias(1);
};

const onPageChange = async (page: number) => {
  currentPage.value = page;
  await loadVias(page);
};

const onSearchChange = () => {
  // A busca é feita localmente através do computed filteredVias
  // Não precisa recarregar da API
};

const selectVia = (via: Via) => {
  emit('viaPreferidaUpdate', via);
};

const handleHide = () => {
  isOpen.value = false;
  unifiedSearch.value = '';
  currentPage.value = 1;
};

const onDialogShow = async () => {
  await loadVias();
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

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

// Form Field
.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

// Custom Input Styling
.custom-input {
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

  :deep(input) {
    color: $background !important;
    padding: 8px 12px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5) !important;
  }

  :deep(.q-icon) {
    color: $cumes-03 !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

// Vias List
.vias-list {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.via-item {
  display: flex;
  align-items: center;
  background-color: rgba($cumes-01, 0.1);
  border-radius: 8px;
  min-height: 60px;
  margin: 6px 0;
  padding: 6px 10px;
  width: calc(100% - 8px);
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    background-color: rgba($cumes-01, 0.15);
    transform: translateX(4px);
  }

  &.via-selected {
    background-color: rgba($cumes-04, 0.15);
    border-color: $cumes-04;
  }
}

.via-nome {
  color: $offwhite;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
}

.via-montanha {
  color: rgba($offwhite, 0.7);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;

  .q-icon {
    color: $cumes-04;
  }
}

.btn-add {
  color: $cumes-01 !important;

  &:hover {
    background-color: rgba($cumes-01, 0.2) !important;
  }

  &[disabled] {
    color: rgba($cumes-01, 0.5) !important;
  }
}

.btn-selected {
  color: $cumes-04 !important;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: $cumes-03;
  font-weight: 600;
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
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

.spacer {
  flex: 1;
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
}

// Custom Pagination
.custom-pagination {
  flex: 1;
  display: flex;
  justify-content: center;

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
