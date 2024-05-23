<template>
  <div class="cards">
    <SearchEntity
      :searchResults="searchResults"
      :page="page"
      :itemsPerPage="itemsPerPage"
      @search="search"
      @clearFilters="clearFilters"
      @select="goViaDetalhadaView"
    >
      <template #filters>
        <v-text-field v-model="searchQuery" label="Buscar via por nome"></v-text-field>
        <v-select v-model="selectedMountain" :items="mountains" item-text="name" item-value="id" label="Montanha"></v-select>
        <v-select v-model="selectedDifficulty" :items="difficulties" label="Dificuldade"></v-select>
      </template>
      <template #resultColumn="{ item }">
        <v-btn @click="goViaDetalhadaView(item)">Detalhes</v-btn>
      </template>
    </SearchEntity>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import viaService from "@/services/viaService";
import montanhaService from "@/services/montanhaService";
import router from "@/router";
import { ViaModel } from "@/models/viaModel";
import { MontanhaModel } from "@/models/montanhaModel";
import SearchEntity from "@/components/SearchEntity.vue";

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
.cards {
  max-width: 800px;
  margin: 0 auto;
}
</style>
