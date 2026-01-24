<template>
  <div class="margem">
    <!-- Campo de busca unificado -->
    <div class="q-pt-lg">
      <q-input
        v-model="localFilters.unifiedSearch"
        :label="unifiedSearchLabel ? unifiedSearchLabel : 'Buscar por nome, bairro ou localização'"
        debounce="300"
        outlined
        color="secondary"
        class="unified-search custom-input"
        label-color="secondary"
        rounded
        @keydown="onInputChange"
      >
        <!-- Botão para abrir o modal de filtros avançados -->
        <template #append>
          <div class="append-buttons">
            <q-icon
              name="filter_alt"
              class="cursor-pointer filter-icon"
              @click="showFilterModal = true"
            />
            <q-icon
              name="delete"
              class="cursor-pointer text-negative delete-icon"
              @click="clearFilters"
            />
          </div>
        </template>
      </q-input>
    </div>

    <!-- Mostrar filtros ativos -->
    <div v-if="activeFiltersList.length > 0" class="active-filters">
      <div
        v-for="filter in activeFiltersList"
        :key="filter.key"
        class="filter-tag"
      >
        <span>{{ filter.label }}</span>
        <q-icon
          name="close"
          class="remove-filter-icon"
          @click="removeFilter(filter.key)"
        />
      </div>
    </div>

    <!-- Modal de Filtros Avançados para Vias -->
    <q-dialog v-model="showFilterModal" persistent>
      <q-card class="filter-modal">
        <q-card-section class="modal-header-section">
          <div class="modal-header">
            <q-icon name="filter_alt" size="28px" class="title-icon" />
            <span>Filtros Avançados</span>
          </div>
        </q-card-section>

        <q-card-section v-if="entity == 'via'" class="modal-body-section">
          <div class="modal-filters">
            <!-- Botões de seleção de filtros -->
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.selectedDifficulty }"
              icon="signal_cellular_alt"
              label="Grau"
              @click="toggleFilterInModal('selectedDifficulty')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.selectedExtension }"
              icon="height"
              label="Extensão"
              @click="toggleFilterInModal('selectedExtension')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.selectedCrux }"
              icon="trending_up"
              label="Crux"
              @click="toggleFilterInModal('selectedCrux')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.selectedExposicao }"
              icon="warning"
              label="Exposição"
              @click="toggleFilterInModal('selectedExposicao')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.tipo_rocha }"
              icon="landscape"
              label="Tipo de Rocha"
              @click="toggleFilterInModal('tipo_rocha')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.tipo_escalada }"
              icon="sports_climbing"
              label="Tipo de Escalada"
              @click="toggleFilterInModal('tipo_escalada')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.modalidade }"
              icon="category"
              label="Modalidade"
              @click="toggleFilterInModal('modalidade')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: showFilterInputInModal.selectedMountain }"
              icon="landscape"
              label="Montanha"
              @click="toggleFilterInModal('selectedMountain')"
              rounded
            />
          </div>

          <!-- Campos dinâmicos de filtros dentro do modal -->
          <div v-if="showFilterInputInModal.selectedDifficulty" class="q-pt-lg">
            <div class="field-label">Selecione o Grau</div>
            <q-select
              v-model="localFilters.selectedDifficulty"
              :options="difficulties"
              outlined
              class="custom-select"
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.selectedExtension" class="q-pt-lg">
            <div class="field-label">Selecione a Extensão</div>
            <div class="extension-buttons">
              <q-btn
                class="extension-btn"
                v-for="(range, label) in extensionCategories"
                :key="label"
                size="sm"
                :class="{ 'selected': localFilters.selectedExtensionCategory === range }"
                @click="filterByExtension(label)"
                :label="label"
              />
            </div>
          </div>

          <div v-if="showFilterInputInModal.selectedCrux" class="q-pt-lg">
            <div class="field-label">Selecione o Crux</div>
            <q-select
              v-model="localFilters.selectedCrux"
              :options="difficulties"
              outlined
              class="custom-select"
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.selectedExposicao" class="q-pt-lg">
            <div class="field-label">Selecione a Exposição</div>
            <q-select
              v-model="localFilters.selectedExposicao"
              :options="exposures"
              outlined
              class="custom-select"
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.tipo_rocha" class="q-pt-lg">
            <div class="field-label">Tipo de Rocha</div>
            <q-input
              v-model="localFilters.tipo_rocha"
              placeholder="Ex: granito, calcário, arenito..."
              outlined
              class="custom-input"
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.tipo_escalada" class="q-pt-lg">
            <div class="field-label">Tipo de Escalada</div>
            <q-input
              v-model="localFilters.tipo_escalada"
              placeholder="Ex: agarras, aderência, chaminé..."
              outlined
              class="custom-input"
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.modalidade" class="q-pt-lg">
            <div class="field-label">Selecione a Modalidade</div>
            <q-select
              v-model="localFilters.modalidade"
              :options="modalidadeOptions"
              outlined
              class="custom-select"
              @update:model-value="updateActiveFilters"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ modalidadeLabels[scope.opt] || scope.opt }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #selected>
                <span v-if="localFilters.modalidade">
                  {{ modalidadeLabels[localFilters.modalidade] || localFilters.modalidade }}
                </span>
              </template>
            </q-select>
          </div>

          <div v-if="showFilterInputInModal.selectedMountain" class="q-pt-lg">
            <div class="field-label">Selecione a Montanha</div>
            <q-select
              v-model="localFilters.selectedMountain"
              :options="mountainOptions"
              option-label="nome"
              option-value="id"
              map-options
              emit-value
              outlined
              class="custom-select"
              @update:model-value="updateActiveFilters"
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #selected>
                <span v-if="localFilters.selectedMountain">
                  {{ mountainOptions.find(m => m.id === localFilters.selectedMountain)?.nome }}
                </span>
              </template>
            </q-select>
          </div>
        </q-card-section>

        <!-- Botões de Ação -->
        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="Aplicar" class="btn-primary-custom" @click="applyFilterChanges" />
          <q-btn flat label="Fechar" class="btn-secondary-custom" @click="showFilterModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { BuscaRequest } from 'src/models/BuscaRequest';
import montanhaService from 'src/services/MontanhaService';
import { ModalidadeEscalada } from 'src/models/ModalidadeEscalada';

// Props e emissões
const props = defineProps<{ entity: string, staticFilters?: Partial<any>, unifiedSearchLabel?: string }>();
const emit = defineEmits(['applyFilters']);
const showExtensionFilters = ref(false);
const localFilters = ref<BuscaRequest>({
  unifiedSearch: '',
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExtension: null,
  selectedCrux: null,
  tipo_rocha: null,
  tipo_escalada: null,
  modalidade: null,
  page: 1,
  itemsPerPage: 10
});
const showFilterInputInModal = ref<Record<string, boolean>>({});
const showFilterModal = ref(false); // Controle de exibição do modal
const showFilterInput = ref<Record<string, boolean>>({});
const activeFilters = ref<Record<string, boolean>>({}); // Filtros ativos
const extensionCategories = ref({
  'Menor que 50 metros': [0, 50],
  'Entre 50 e 100 metros': [50, 100],
  'Entre 100 e 200 metros': [100, 200],
  'Entre 200 e 300 metros': [200, 300],
  'Mais de 300 metros': [300, Infinity]
});
type ExtensionCategory = keyof typeof extensionCategories.value;

const difficulties = [
  '1', 'Isup', '2', '3', '4', '5',
  'IIsup', 'IIIsup', 'IVsup', 'Vsup', 'VIIb', '6', 'VIsup', 'VIIa',
  'VIIIb', 'VIIc', 'VIIIc', 'IXa', 'Xa', 'VII(3)', '7', 'V(2)', 'VIII', 'VIIIa'
];
const exposures = ['e1', 'e2', 'e3', 'e4', 'e5'];
const mountainOptions = ref<any[]>([]);

// Opções de modalidade formatadas em português para o select
const modalidadeOptions = [
  ModalidadeEscalada.TRADICIONAL,
  ModalidadeEscalada.ESPORTIVA,
  ModalidadeEscalada.BOULDER,
  ModalidadeEscalada.BIG_WALL,
  ModalidadeEscalada.ARTIFICIAL,
  ModalidadeEscalada.PSICOBLOC
];

// Mapa para converter enum para label em português
const modalidadeLabels: Record<ModalidadeEscalada, string> = {
  [ModalidadeEscalada.TRADICIONAL]: 'Tradicional',
  [ModalidadeEscalada.ESPORTIVA]: 'Esportiva',
  [ModalidadeEscalada.BOULDER]: 'Boulder',
  [ModalidadeEscalada.BIG_WALL]: 'Big Wall',
  [ModalidadeEscalada.ARTIFICIAL]: 'Artificial',
  [ModalidadeEscalada.PSICOBLOC]: 'Psicobloc'
};

// Atualiza a lista de filtros ativos
const updateActiveFilters = () => {
  emitFilters();
};

// Lista de filtros ativos
const activeFiltersList = computed(() => {
  const filters: { label: string, key: string }[] = [];

  // Adiciona o filtro de grau se estiver selecionado
  if (localFilters.value.selectedDifficulty) {
    filters.push({ label: `Grau: ${localFilters.value.selectedDifficulty}`, key: 'selectedDifficulty' });
  }

  // Adiciona o filtro de extensão se estiver selecionado
  if (localFilters.value.selectedExtensionCategory) {
    const extensionKey = Object.entries(extensionCategories.value).find(
      ([, range]) => range === localFilters.value.selectedExtensionCategory
    )?.[0];

    if (extensionKey) {
      filters.push({ label: `Extensão: ${extensionKey}`, key: 'selectedExtensionCategory' });
    }
  }

  // Adiciona o filtro de crux se estiver selecionado
  if (localFilters.value.selectedCrux) {
    filters.push({ label: `Crux: ${localFilters.value.selectedCrux}`, key: 'selectedCrux' });
  }

  // Adiciona o filtro de exposição se estiver selecionado
  if (localFilters.value.selectedExposicao) {
    filters.push({ label: `Exposição: ${localFilters.value.selectedExposicao}`, key: 'selectedExposicao' });
  }

  // Adiciona o filtro de tipo de rocha se estiver preenchido
  if (localFilters.value.tipo_rocha) {
    filters.push({ label: `Tipo de Rocha: ${localFilters.value.tipo_rocha}`, key: 'tipo_rocha' });
  }

  // Adiciona o filtro de tipo de escalada se estiver preenchido
  if (localFilters.value.tipo_escalada) {
    filters.push({ label: `Tipo de Escalada: ${localFilters.value.tipo_escalada}`, key: 'tipo_escalada' });
  }

  // Adiciona o filtro de modalidade se estiver selecionado
  if (localFilters.value.modalidade) {
    const modalidadeLabel = modalidadeLabels[localFilters.value.modalidade] || localFilters.value.modalidade;
    filters.push({ label: `Modalidade: ${modalidadeLabel}`, key: 'modalidade' });
  }

  // Adiciona o filtro de montanha se estiver selecionado
  if (localFilters.value.selectedMountain) {
    const montanha = mountainOptions.value.find(m => m.id === localFilters.value.selectedMountain);
    if (montanha) {
      filters.push({ label: `Montanha: ${montanha.nome}`, key: 'selectedMountain' });
    }
  }

  return filters;
});

const removeFilter = (key: string) => {
  // Remove o filtro selecionado
  if (key === 'selectedDifficulty') {
    localFilters.value.selectedDifficulty = null;
  } else if (key === 'selectedExtensionCategory') {
    localFilters.value.selectedExtensionCategory = null;
  } else if (key === 'selectedCrux') {
    localFilters.value.selectedCrux = null;
  } else if (key === 'selectedExposicao') {
    localFilters.value.selectedExposicao = null;
  } else if (key === 'tipo_rocha') {
    localFilters.value.tipo_rocha = null;
  } else if (key === 'tipo_escalada') {
    localFilters.value.tipo_escalada = null;
  } else if (key === 'modalidade') {
    localFilters.value.modalidade = null;
  } else if (key === 'selectedMountain') {
    localFilters.value.selectedMountain = null;
  }

  // Atualiza a lista de filtros e emite a mudança
  emitFilters();
};

// Alternar exibição de filtros no modal
const toggleFilterInModal = (filter: string) => {
  showFilterInputInModal.value[filter] = !showFilterInputInModal.value[filter];
};

// Aplicar mudanças de filtros no modal
const applyFilterChanges = () => {
  emitFilters();
  showFilterModal.value = false;
};

// Inicializa as montanhas
onMounted(async () => {
  try {
    mountainOptions.value = await montanhaService.getAll();
  } catch (error) {
    console.error('Error getting mountains:', error);
  }
});

// Atualiza a busca automaticamente a partir de 2 letras
const onInputChange = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value;
  if (value.length >= 2) {
    emitFilters();
  }
  if (value.length === 0) {
    emitFilters();
  }
};

// Dispara a busca ao selecionar um filtro
watch(
  () => localFilters.value,
  (newFilters, oldFilters) => {
    if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
      emitFilters();
    }
  },
  { deep: true }
);

// Verifica se há filtros ativos
computed(() => {
  return Object.values(activeFilters.value).some((value) => value);
});
// Controla a exibição dos filtros avançados
// Limpa filtros e fecha campos
const clearFilters = () => {
  localFilters.value = {
    unifiedSearch: '',
    selectedMountain: null,
    bairro: '',
    selectedExposicao: null,
    selectedDifficulty: null,
    selectedExtension: null,
    selectedCrux: null,
    tipo_rocha: null,
    tipo_escalada: null,
    modalidade: null,
    page: 1,
    itemsPerPage: 10,
    ...props.staticFilters
  };
  Object.keys(activeFilters.value).forEach(key => {
    activeFilters.value[key as keyof typeof activeFilters.value] = false;
  });
  showFilterInput.value.selectedDifficulty = false;
  showFilterInput.value.selectedCrux = false;
  showFilterInput.value.selectedExtension = false;
  showFilterInput.value.selectedExposicao = false;
  showFilterInput.value.tipo_rocha = false;
  showFilterInput.value.tipo_escalada = false;
  showFilterInput.value.modalidade = false;
  showFilterInput.value.selectedMountain = false;
  showExtensionFilters.value = false;
  emitFilters();
};

const emitFilters = () => {
  const filtersToEmit = {
    ...localFilters.value,
    ...props.staticFilters // Inclui os filtros estáticos
  };
  emit('applyFilters', filtersToEmit);
};

// Controla a exibição dos filtros
/* const toggleFilter = (filter: FilterKey) => {
  if (filter === 'selectedExtension') {
    showExtensionFilters.value = !showExtensionFilters.value;
  } else {
    showFilterInput.value[filter] = !showFilterInput.value[filter];
  }
}; */

const filterByExtension = (category: string) => {
  const selectedRange = extensionCategories.value[category as ExtensionCategory];
  if (selectedRange) {
    localFilters.value.selectedExtensionCategory = selectedRange;
    emitFilters();
  }
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

// Input de busca unificado - igual ao PerfilEditaForm
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
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 10px 14px !important;
  }

  :deep(input),
  :deep(input[type="text"]),
  :deep(.q-field__input) {
    color: $background !important;
    padding: 10px 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5) !important;
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

  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color !important;
    }
  }

  // Botão de filtro dentro do append
  :deep(.q-field__append) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 8px;
  }

  :deep(.q-field__append .append-buttons) {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
  }

  :deep(.q-field__append .filter-icon) {
    font-size: 24px !important;
    color: $cumes-03 !important;
    cursor: pointer;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }

  :deep(.q-field__append .delete-icon) {
    font-size: 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
}

// Modal de filtros
.filter-modal {
  background-color: $background !important;
  border: 2px solid $cumes-01 !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px $box-shadow-dark !important;
  max-width: 500px !important;
  width: 92vw !important;

  @media (min-width: 768px) {
    width: 600px !important;
  }

  @media (min-width: 1024px) {
    width: 700px !important;
  }
}

.modal-header-section {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%) !important;
  border-bottom: 3px solid $cumes-03 !important;
  padding: 16px !important;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: $offwhite;
  
  .title-icon {
    color: $cumes-04;
  }
}

.modal-body-section {
  background-color: $background;
  padding: 20px !important;
}

.modal-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

// Selects customizados
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
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 10px 14px !important;
  }

  :deep(.q-field__input) {
    color: $background !important;
    padding: 10px 14px !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

// Botões de extensão
.extension-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.extension-btn {
  background-color: $offwhite !important;
  color: $background !important;
  border: 2px solid $cumes-01 !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;

  &.selected {
    background-color: $cumes-01 !important;
    color: $offwhite !important;
    border-color: $cumes-01 !important;
  }

  &:hover {
    background-color: rgba($cumes-01, 0.1) !important;
  }
}

// Filtros ativos
.active-filters {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background-color: $cumes-03;
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px $box-shadow-light;

  span {
    color: $offwhite !important;
    font-weight: 600;
    font-size: 13px;
  }
}

.remove-filter-icon {
  font-size: 16px;
  cursor: pointer;
  color: $offwhite !important;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 2px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

// Botões de filtro no modal
.q-btn.filter-btn {
  background-color: $offwhite !important;
  color: $background !important;
  border: 2px solid $cumes-01 !important;
  border-radius: 8px !important;
  padding: 10px 16px !important;
  font-weight: 600 !important;
  margin-right: 8px;
  margin-bottom: 8px;

  &:hover {
    background-color: rgba($cumes-01, 0.1) !important;
  }

  &.active {
    background-color: $cumes-01 !important;
    color: $offwhite !important;
    border-color: $cumes-01 !important;
  }
}

// Botões do modal
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: darken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }
}

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
  }
}
</style>
