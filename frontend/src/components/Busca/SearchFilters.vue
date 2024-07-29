<template>
  <div>
    <q-input
      v-model="localFilters.searchQuery"
      label="Buscar via por nome"
      debounce="300"
      outlined
    />
    <q-select
      v-model="localFilters.selectedMountain"
      :options="mountainOptions"
      option-label="name"
      option-value="id"
      label="Montanha"
      outlined
    />
    <q-select
      v-model="localFilters.selectedDifficulty"
      :options="difficulties"
      label="Dificuldade"
      outlined
    />
    <q-btn label="Buscar" @click="emitFilters" />
    <q-btn label="Clear" color="secondary" @click="clearFilters" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from "vue";
import montanhaService from "src/services/MontanhaService";
import { SearchRequest } from "src/models/SearchRequest";

const emit = defineEmits(["applyFilters"]);

const localFilters = ref<SearchRequest>({
  searchQuery: "",
  selectedMountain: null,
  selectedDifficulty: null,
  selectedExposure: null
});

const difficulties = ["I", "II", "III", "IV", "V", "A1", "A2", "A3"];
const mountainOptions = ref<any[]>([]);

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
    selectedExposure: null
  };
  console.log("Cleared filters, emitting empty filters.");
  emit("applyFilters", localFilters.value);
};

const emitFilters = () => {
  console.log("Emitting filters:", localFilters.value);
  emit("applyFilters", localFilters.value);
};
</script>
