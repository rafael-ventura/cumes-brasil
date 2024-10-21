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
        <template #append>
          <!-- Ícone de lixeira para limpar -->
          <q-icon
            name="delete"
            class="cursor-pointer text-negative"
            @click="clearFilters"
          />
        </template>
      </q-input>
    </div>

    <!-- Outros filtros continuam como botões, caso seja necessário -->
    <div class="row q-col-gutter-sm q-gutter-md justify-center">
      <q-btn v-if="enabledFilters.includes('selectedDifficulty')" :class="{ active: activeFilters.selectedDifficulty }"
             rounded icon="signal_cellular_alt" size="md" @click="toggleFilter('selectedDifficulty')" label="Grau"/>
      <q-btn v-if="enabledFilters.includes('selectedExtension')" :class="{ active: activeFilters.selectedExtension }"
             rounded icon="height" size="md" @click="toggleFilter('selectedExtension')" label="Extensão"/>
      <q-btn v-if="enabledFilters.includes('selectedCrux')" :class="{ active: activeFilters.selectedCrux }" rounded
             icon="trending_up" size="md" @click="toggleFilter('selectedCrux')" label="Crux"/>
    </div>

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
      <q-btn class="q-pr-md" @click="filterByExtension('Menor que 50 metros')" label="Menor que 50 metros"/>
      <q-btn class="q-pr-md" @click="filterByExtension('Entre 50 e 100 metros')" label="Entre 50 e 100 metros"/>
      <q-btn class="q-pr-md" @click="filterByExtension('Entre 100 e 200 metros')" label="Entre 100 e 200 metros"/>
      <q-btn class="q-pr-md" @click="filterByExtension('Entre 200 e 300 metros')" label="Entre 200 e 300 metros"/>
      <q-btn class="q-pr-md" @click="filterByExtension('Mais de 300 metros')" label="Mais de 300 metros"/>
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

    <!-- Separador e botão de limpar -->
    <div class="buttons" v-if="Object.values(showFilterInput).some(value => value) || showExtensionFilters">
      <q-btn class="right-margem" label="Limpar" @click="clearFilters" />
    </div>
    <q-separator spaced/>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, ref, watch } from 'vue';
import { SearchRequest } from 'src/models/SearchRequest';
import montanhaService from 'src/services/MontanhaService';

type FilterKey =
  'unifiedSearch'
  | 'selectedDifficulty'
  | 'selectedExtension'
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
const showFilterInput = ref<Record<FilterKey, boolean>>({
  unifiedSearch: false,
  selectedDifficulty: false,
  selectedExtension: false,
  selectedCrux: false
});
const activeFilters = ref<Record<FilterKey, boolean>>({
  unifiedSearch: false,
  selectedDifficulty: false,
  selectedExtension: false,
  selectedCrux: false
});
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
