<template>
  <div class="margem">
    <!-- Campo de busca unificado -->
    <div class="q-pt-lg">
      <q-input
        v-model="localFilters.unifiedSearch"
        :label="unifiedSearchLabel ? unifiedSearchLabel : 'Buscar por nome, bairro ou montanha'"
        debounce="300"
        class="unified-search"
        outlined
        rounded
        @keydown="onInputChange"
      >
        <!-- Botão para abrir o modal de filtros avançados -->
        <template #append>
          <q-btn
            flat
            dense
            round
            icon="filter_alt"
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

    <!-- Mostrar filtros ativos -->
    <div v-if="activeFiltersList.length > 0" class="active-filters">
      <div
        v-for="filter in activeFiltersList"
        :key="filter.key"
        class="filter-tag"
      >
        <span class="text-black">{{ filter.label }}</span>
        <q-icon
          name="close"
          class="text-black remove-filter-icon"
          @click="removeFilter(filter.key)"
        />
      </div>
    </div>

    <!-- Modal de Filtros Avançados para Vias -->
    <q-dialog v-model="showFilterModal" persistent>
      <q-card class="filter-modal">
        <q-card-section class="q-pb-none">
          <div class="modal-header">Filtros Avançados</div>
        </q-card-section>

        <q-card-section v-if="entity == 'via'">
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
          </div>

          <!-- Campos dinâmicos de filtros dentro do modal -->
          <div v-if="showFilterInputInModal.selectedDifficulty" class="q-pt-lg">
            <q-select
              v-model="localFilters.selectedDifficulty"
              :options="difficulties"
              label="Selecione o Grau"
              outlined
              @update:model-value="updateActiveFilters"
            />
          </div>

          <div v-if="showFilterInputInModal.selectedExtension" class="q-pt-lg">
            <q-btn
              class="q-pr-md"
              v-for="(range, label) in extensionCategories"
              :key="label"
              size="sm"
              :class="{ 'selected': localFilters.selectedExtensionCategory === range }"
              @click="filterByExtension(label)"
              :label="label"
            />
          </div>

          <div v-if="showFilterInputInModal.selectedCrux" class="q-pt-lg">
            <q-select
              v-model="localFilters.selectedCrux"
              :options="difficulties"
              label="Selecione o Crux"
              outlined
              @update:model-value="updateActiveFilters"
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
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, onMounted, ref, watch } from 'vue';
import { SearchRequest } from 'src/models/SearchRequest';
import montanhaService from 'src/services/MontanhaService';

// Props e emissões
const props = defineProps<{ entity: string, staticFilters?: Partial<any>, unifiedSearchLabel?: string }>();
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
  'I', 'Isup', 'II', 'III', 'IV', 'V', 'A1', 'A2', 'A3',
  'IIsup', 'IIIsup', 'IVsup', 'Vsup', 'VIIb', 'VI', 'VIsup', 'VIIa',
  'VIIIa/b', 'VIIIb', 'VIIc', 'VIIIb/c', 'VIIIc', 'IXa', 'III (A1/VIIIa)',
  'VIIb/c', 'Xa', 'VII(3)', 'VII', 'V(2)', 'VIII', 'VIIIa'
];
const mountainOptions = ref<any[]>([]);

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

  return filters;
});

const removeFilter = (key: string) => {
  // Remove o filtro selecionado
  if (key === 'selectedDifficulty') {
    localFilters.value.selectedDifficulty = null;
  } else if (key === 'selectedExtensionCategory') {
    localFilters.value.selectedExtensionCategory = null;
  } else if (key === 'selectedCrux') {
    localFilters.value.selectedCrux = '';
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
    mountainOptions.value = await montanhaService.getAllName();
  } catch (error) {
    console.error('Error getting mountains:', error);
  }
});

// Atualiza a busca automaticamente a partir de 2 letras
const onInputChange = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value;
  if (value.length >= 2) {
    console.log('Buscando >=2:', value);
    emitFilters();
  }
  if (value.length === 0) {
    console.log('Buscando 0:', value);
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

<style scoped>
.unified-search {
  outline: red;
}

.filter-modal {
  background-color: #2c2c2c;
  border-radius: 8px;
  padding: 16px;
}

.modal-header {
  font-size: 24px;
  font-weight: bold;
  color: #fcbd7b;
  margin-bottom: 16px;
}

.modal-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-filters {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background-color: #fabc7a; /* Fundo laranja */
  padding: 4px 8px; /* Espaçamento interno */
  border-radius: 4px; /* Bordas arredondadas */
  display: flex;
  align-items: center; /* Alinha o texto no centro */
  gap: 4px; /* Espaço entre o texto e o ícone */
}

.remove-filter-icon {
  font-size: 16px;
  cursor: pointer;
  color: #2c2c2c; /* Cor do ícone */
  border: 1px dotted #2c2c2c; /* Borda do ícone */
  border-radius: 50%; /* Ícone circular */
  margin-left: 4px; /* Margem à esquerda */
}

.q-btn.filter-btn {
  background-color: #333333;
  color: #fcbd7b;
}

.q-btn.filter-btn.active {
  background-color: #fcbd7b;
  color: #333333;
}

.selected {
  background-color: #fcbd7b;
  color: #2c2c2c;
}
</style>
