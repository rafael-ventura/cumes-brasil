<template>
  <div class="search-via">
    <div class="filters">
      <!-- Campo de busca por nome da via -->
      <v-text-field v-model="searchQuery" label="Buscar via por nome"></v-text-field>

      <!-- Dropdown para selecionar a montanha -->
      <v-select v-model="selectedMountain" :items="mountains" item-text="name" item-value="id" label="Montanha"></v-select>

      <!-- Dropdown para selecionar o grau de dificuldade -->
      <v-select v-model="selectedDifficulty" :items="difficulties" label="Dificuldade"></v-select>

      <!-- Botão para iniciar a busca e limpar filtros -->
      <v-btn @click="search">Buscar</v-btn>
      <v-btn @click="clearFilters">Limpar filtros</v-btn>
    </div>

    <!-- Tabela para exibir os resultados da busca -->
    <v-data-table
      :items="searchResults"
      class="elevation-1"
      :page.sync="page"
      :items-per-page.sync="itemsPerPage"
    >
      <template #item.action="{ item }">
        <v-icon small class="mr-2" @click="goViaDetalhadaView(item)">
          mdi-pencil
        </v-icon>
      </template>
      <template #no-data>
        Nenhum resultado encontrado
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import viaService from "@/services/viaService";
import montanhaService from "@/services/montanhaService";
import router from "@/router";
import { ViaModel } from "@/models/viaModel";
import { MontanhaModel } from "@/models/montanhaModel";

const page = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const selectedMountain = ref("");
const selectedDifficulty = ref("");
const searchResults = ref<ViaModel[]>([]);
const selectedExposure = ref("");
const mountains = ref<MontanhaModel[]>([]);
const difficulties = ['I', 'II', 'III', 'IV', 'V', 'A1', 'A2', 'A3'];

onMounted(async () => {
  try {
    console.log("Getting mountains and Vias");
    const allVias = await viaService.getAllVias();
    searchResults.value = allVias || [];
    mountains.value = await montanhaService.getAll();
  } catch (error) {
    console.error("Error getting mountains:", error);
  }
});

const search = async () => {
  if (!searchQuery.value && !selectedMountain.value && !selectedDifficulty.value && !selectedExposure.value) {
    return;
  }

  try {
    const response = await viaService.searchVias({
      searchQuery: searchQuery.value,
      selectedMountain: selectedMountain.value,
      selectedDifficulty: selectedDifficulty.value,
      selectedExposure: selectedExposure.value,
      page: page.value,
      itemsPerPage: itemsPerPage.value
    });
    searchResults.value = response as ViaModel[];
  } catch (error) {
    console.error("Error searching routes:", error);
  }
};

const clearFilters = async () => {
  searchQuery.value = "";
  selectedMountain.value = "";
  selectedDifficulty.value = "";
  selectedExposure.value = "";
  try {
    const allVias = await viaService.getAllVias();
    searchResults.value = allVias || [];
  } catch (error) {
    console.error("Error getting all routes:", error);
  }
};

const goViaDetalhadaView = async (via: ViaModel) => {
  try {
    await router.push(`/vias/${via.id}`);
  } catch (error) {
    console.error("Error navigating to route details:", error);
  }
};
</script>

<style scoped>
.search-via {
  max-width: 800px;
  margin: 0 auto;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
