<template>
  <div class="margem">
    <!-- Campo de busca unificado -->
    <div class="q-pt-lg">
      <q-input
        v-model="localFilters.unifiedSearch"
        label="Buscar por nome, bairro ou montanha"
        debounce="300"
        outlined
        rounded
        @change="onInputChange"
      >
        <!-- Botão de filtros avançados -->
        <!-- Botão para abrir o modal de filtros avançados -->
        <template #append>
          <q-btn
            flat
            dense
            round
            icon="tune"
            class="filter-btn"
            @click="showFilterModal = true"
          />
          <!-- Ícone de lixeira para limpar -->
          <q-icon
            name="delete"
            class="cursor-pointer text-negative"
            @click="clearFilters"
          />
        </template>
      </q-input>
    </div>

    <!-- Filtros avançados -->
    <!-- Modal de Filtros Avançados -->
    <q-dialog v-model="showFilterModal" persistent>
      <q-card class="filter-modal">
        <q-card-section class="q-pb-none">
          <div class="modal-header">Filtros Avançados</div>
        </q-card-section>

        <q-card-section>
          <div class="modal-filters">
            <q-btn
              class="filter-btn"
              :class="{ active: activeFilters.selectedDifficulty }"
              icon="signal_cellular_alt"
              label="Grau"
              @click="toggleFilter('selectedDifficulty')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: activeFilters.selectedExtension }"
              icon="height"
              label="Extensão"
              @click="toggleFilter('selectedExtension')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: activeFilters.selectedCrux }"
              icon="trending_up"
              label="Crux"
              @click="toggleFilter('selectedCrux')"
              rounded
            />
            <q-btn
              class="filter-btn"
              :class="{ active: activeFilters.selectedExposicao }"
              icon="warning"
              label="Exposição"
              @click="toggleFilter('selectedExposicao')"
              rounded
            />
          </div>
        </q-card-section>

        <!-- Botões de Ação -->
        <q-card-actions align="right">
          <q-btn flat label="Aplicar" color="primary" @click="applyFilterChanges" />
          <q-btn flat label="Fechar" color="negative" @click="showFilterModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Renderiza os inputs para os filtros selecionados -->
    <div v-if="showFilterInput.selectedDifficulty" class="q-pt-lg">
      <q-select
        v-model="localFilters.selectedDifficulty"
        :options="difficulties"
        label="Grau"
        outlined
        @update:model-value="emitFilters"
      />
    </div>
    <div v-if="showExtensionFilters" class="q-pt-lg row q-col-gutter-sm q-gutter-md justify-center">
      <q-btn
        class="q-pr-md"
        size="sm"
        :class="{ 'selected': localFilters.selectedExtensionCategory === extensionCategories['Menor que 50 metros'] }"
        @click="filterByExtension('Menor que 50 metros')"
        label="Menor que 50 metros"
      />
      <q-btn
        class="q-pr-md"
        size="sm"
        :class="{ 'selected': localFilters.selectedExtensionCategory === extensionCategories['Entre 50 e 100 metros'] }"
        @click="filterByExtension('Entre 50 e 100 metros')"
        label="Entre 50 e 100 metros"
      />
      <q-btn
        class="q-pr-md"
        size="sm"
        :class="{ 'selected': localFilters.selectedExtensionCategory === extensionCategories['Entre 100 e 200 metros'] }"
        @click="filterByExtension('Entre 100 e 200 metros')"
        label="Entre 100 e 200 metros"
      />
      <q-btn
        class="q-pr-md"
        size="sm"
        :class="{ 'selected': localFilters.selectedExtensionCategory === extensionCategories['Entre 200 e 300 metros'] }"
        @click="filterByExtension('Entre 200 e 300 metros')"
        label="Entre 200 e 300 metros"
      />
      <q-btn
        class="q-pr-md"
        size="sm"
        :class="{ 'selected': localFilters.selectedExtensionCategory === extensionCategories['Mais de 300 metros'] }"
        @click="filterByExtension('Mais de 300 metros')"
        label="Mais de 300 metros"
      />
    </div>
    <div v-if="showFilterInput.selectedCrux" class="q-pt-lg">
      <q-input
        v-model="localFilters.selectedCrux"
        label="Crux"
        debounce="300"
        outlined
        @input="emitFilters"
      />
    </div>

    <q-separator spaced/>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, onMounted, ref, watch } from 'vue';
import { SearchRequest } from 'src/models/SearchRequest';
import montanhaService from 'src/services/MontanhaService';

type FilterKey =
  'unifiedSearch'
  | 'selectedDifficulty'
  | 'selectedExtension'
  | 'selectedExposicao'
  | 'selectedCrux';

type ExtensionCategory = 'Menor que 50 metros'
  | 'Entre 50 e 100 metros'
  | 'Entre 100 e 200 metros'
  | 'Entre 200 e 300 metros'
  | 'Mais de 300 metros';

// Props e emissões
const props = defineProps<{ enabledFilters: string[], staticFilters?: Partial<any> }>();
const emit = defineEmits(['applyFilters']);
const showExtensionFilters = ref(false);
const localFilters = ref<SearchRequest>({
  unifiedSearch: '',
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExtension: null,
  selectedCrux: null,
  page: 1,
  itemsPerPage: 10
});
const showAdvancedFilters = ref(false); // Controle para exibir filtros avançados
const showFilterModal = ref(false); // Controle de exibição do modal
const showFilterInput = ref<Record<string, boolean>>({});
/* const showFilterInput = ref<Record<FilterKey, boolean>>({
  unifiedSearch: false,
  selectedDifficulty: false,
  selectedExtension: false,
  selectedCrux: false
}); */
const activeFilters = ref<Record<string, boolean>>({}); // Filtros ativos
/* const activeFilters = ref<Record<FilterKey, boolean>>({
  unifiedSearch: false,
  selectedDifficulty: false,
  selectedExtension: false,
  selectedCrux: false
}); */
const difficulties = [
  'I', 'Isup', 'II', 'III', 'IV', 'V', 'A1', 'A2', 'A3',
  'IIsup', 'IIIsup', 'IVsup', 'Vsup', 'VIIb', 'VI', 'VIsup', 'VIIa',
  'VIIIa/b', 'VIIIb', 'VIIc', 'VIIIb/c', 'VIIIc', 'IXa', 'III (A1/VIIIa)',
  'VIIb/c', 'Xa', 'VII(3)', 'VII', 'V(2)', 'VIII', 'VIIIa'
];
const mountainOptions = ref<any[]>([]);
const extensionCategories = ref({
  'Menor que 50 metros': [0, 50],
  'Entre 50 e 100 metros': [50, 100],
  'Entre 100 e 200 metros': [100, 200],
  'Entre 200 e 300 metros': [200, 300],
  'Mais de 300 metros': [300, Infinity]
});

// Inicializa as montanhas
onMounted(async () => {
  try {
    mountainOptions.value = await montanhaService.getAllName();
  } catch (error) {
    console.error('Error getting mountains:', error);
  }
});

// Atualiza a busca automaticamente a partir de 2 letras
const onInputChange = (value: string) => {
  if (value.length >= 2) {
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

// Aplica mudanças de filtros no modal
const applyFilterChanges = () => {
  emitFilters();
  showFilterModal.value = false;
};

// Verifica se há filtros ativos
const hasActiveFilters = computed(() => {
  return Object.values(activeFilters.value).some((value) => value);
});

// Controla a exibição dos filtros avançados
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

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
const toggleFilter = (filter: FilterKey) => {
  if (filter === 'selectedExtension') {
    showExtensionFilters.value = !showExtensionFilters.value;
  } else {
    showFilterInput.value[filter] = !showFilterInput.value[filter];
  }
};

const filterByExtension = (category: ExtensionCategory) => {
  localFilters.value.selectedExtensionCategory = extensionCategories.value[category];
  emitFilters();
};
</script>

<style scoped>
.selected {
  background-color: #bce9b4; /* Cor de destaque */
  border: 2px solid #2c2c2c; /* Borda de destaque */
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.right-margem {
  margin-right: 16px;
  background-color: #bce9b4;
}

.right-margem2 {
  background-color: #daffd3;
}
</style>
