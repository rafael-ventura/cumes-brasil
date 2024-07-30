<template>
  <div>
    <div class="filter-buttons">
      <q-btn round icon="search" @click="toggleFilter('searchQuery')" label="Buscar por nome"/>
      <q-btn round icon="terrain" @click="toggleFilter('selectedMountain')" label="Montanha"/>
      <q-btn round icon="signal_cellular_alt" @click="toggleFilter('selectedDifficulty')" label="Grau"/>
      <q-btn round icon="height" @click="toggleFilter('selectedExtension')" label="Extensão"/>
      <q-btn round icon="trending_up" @click="toggleFilter('selectedCrux')" label="Crux"/>
      <q-btn label="Buscar" @click="emitFilters"/>
      <q-btn label="Clear" color="secondary" @click="clearFilters"/>
    </div>

    <!-- Filter inputs -->
    <div v-if="showFilterInput.searchQuery">
      <q-input
        v-model="localFilters.searchQuery"
        label="Buscar via por nome"
        debounce="300"
        outlined
      />
    </div>
    <!-- Montanha sempre visível -->
    <div v-if="showFilterInput.selectedMountain">
      <q-select
        v-model="localFilters.selectedMountain"
        :options="mountainOptions"
        option-label="name"
        option-value="id"
        label="Montanha"
        outlined
      />
    </div>
    <div v-if="showFilterInput.selectedDifficulty">
      <q-select
        v-model="localFilters.selectedDifficulty"
        :options="difficulties"
        label="Grau"
        outlined
      />
    </div>
    <div v-if="showExtensionFilters">
      <q-input
        v-model="localFilters.selectedExtension"
        label="Extensão"
        debounce="300"
        outlined
      />
      <q-btn round @click="filterByExtension('Menor que 50 metros')" label="Menor que 50 metros"/>
      <q-btn round @click="filterByExtension('Entre 50 e 100 metros')" label="Entre 50 e 100 metros"/>
      <q-btn round @click="filterByExtension('Entre 100 e 200 metros')" label="Entre 100 e 200 metros"/>
      <q-btn round @click="filterByExtension('Entre 200 e 300 metros')" label="Entre 200 e 300 metros"/>
      <q-btn round @click="filterByExtension('Mais de 300 metros')" label="Mais de 300 metros"/>
    </div>
    <div v-if="showFilterInput.selectedCrux">
      <q-input
        v-model="localFilters.selectedCrux"
        label="Crux"
        debounce="300"
        outlined
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, ref } from "vue";
import { SearchRequest } from "src/models/SearchRequest";
import montanhaService from "src/services/MontanhaService";

// Definindo o tipo para as chaves dos filtros
type FilterKey =
  "searchQuery"
  | "selectedMountain"
  | "selectedDifficulty"
  | "selectedExtension"
  | "selectedCrux";

type ExtensionCategory = "Menor que 50 metros"
  | "Entre 50 e 100 metros"
  | "Entre 100 e 200 metros"
  | "Entre 200 e 300 metros"
  | "Mais de 300 metros"

const emit = defineEmits(["applyFilters"]);

const showExtensionFilters = ref(false);

const localFilters = ref<SearchRequest>({
  searchQuery: "",
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExtension: null,
  selectedCrux: null,
  page: 1,
  itemsPerPage: 10
});

const showFilterInput = ref<Record<FilterKey, boolean>>({
  searchQuery: false,
  selectedMountain: false,
  selectedDifficulty: false,
  selectedExtension: false,
  selectedCrux: false
});

const difficulties = [
  "I", "Isup", "II", "III", "IV", "V", "A1", "A2", "A3",
  "IIsup", "IIIsup", "IVsup", "Vsup", "VIIb", "VI", "VIsup", "VIIa",
  "VIIIa/b", "VIIIb", "VIIc", "VIIIb/c", "VIIIc", "IXa", "III (A1/VIIIa)",
  "VIIb/c", "Xa", "VII(3)", "VII", "V(2)", "VIII", "VIIIa"
];
const mountainOptions = ref<any[]>([]);
const extensionCategories = ref({
  "Menor que 50 metros": [0, 50],
  "Entre 50 e 100 metros": [50, 100],
  "Entre 100 e 200 metros": [100, 200],
  "Entre 200 e 300 metros": [200, 300],
  "Mais de 300 metros": [300, Infinity]
});

onMounted(async () => {
  try {
    mountainOptions.value = await montanhaService.getAllName();
  } catch (error) {
    console.error("Error getting mountains:", error);
  }
});

const clearFilters = () => {
  localFilters.value = {
    searchQuery: "",
    selectedMountain: null,
    selectedDifficulty: null,
    selectedExtension: null,
    selectedCrux: null,
    page: 1,
    itemsPerPage: 10
  };
  emit("applyFilters", localFilters.value);
};

const emitFilters = () => {
  emit("applyFilters", localFilters.value);
};

// Usando o tipo FilterKey ao acessar as propriedades de showFilterInput
const toggleFilter = (filter: FilterKey) => {
  if (filter === "selectedExtension") {
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
.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-around;
}

.filter-buttons q-btn {
  margin-bottom: 8px;
}

.filter-inputs {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
