<template>
  <div class="search-via">
    <div class="filters">
      <!-- Campo de busca por nome da via -->
      <input type="text" v-model="searchQuery" placeholder="Buscar via por nome">

      <!-- Dropdown para selecionar a montanha -->
      <select v-model="selectedMountain">
        <option value="">Todas as montanhas</option>
        <option v-for="mountain in mountains" :key="mountain.id" :value="mountain.id">{{ mountain.name }}</option>
      </select>

      <!-- Dropdown para selecionar o grau de dificuldade -->
      <select v-model="selectedDifficulty">
        <option value="">Qualquer dificuldade</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
        <option value="V">V</option>
        <!-- with artificial ( a1, a2...)        -->
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="A3">A3</option>
      </select>

      <!-- Botão para iniciar a busca -->
      <button @click="search">Buscar</button>
    </div>

    <!-- Tabela para exibir os resultados da busca -->
    <table class="result-table" v-if="searchResults.length">
      <thead>
      <tr>
        <th>Nome da Via</th>
        <th>Montanha</th>
        <th>Grau de Dificuldade</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="via in searchResults" :key="via.id" @click="goViaDetalhadaView(via)">
        <td>{{ via.nome }}</td>
        <td>{{ via.montanha_id }}</td> <!-- Altere 'mountain' para 'montanha_id' -->
        <td>{{ via.grau }}</td> <!-- Altere 'difficulty' para 'grau' -->
      </tr>
      </tbody>
    </table>
    <div v-else>
      Nenhum resultado encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import viaService from "@/services/viaService";
import montanhaService from "@/services/montanhaService";
import router from "@/router";
import { ViaModel } from "@/models/viaModel";
import { MontanhaModel } from "@/models/montanhaModel";

const searchQuery = ref("");
const selectedMountain = ref("");
const selectedDifficulty = ref("");
const searchResults = ref<ViaModel[]>([]);
const selectedExposure = ref("");
const mountains = ref<MontanhaModel[]>([]);

onMounted(async () => {
  try {
    console.log("Getting mountains and Vias");
    const allVias = await viaService.getAllVias();
    searchResults.value = allVias || [];
    mountains.value = await montanhaService.getAll();
  } catch (error) {
    console.error("Error getting mountains:", error);
    // Trate os erros de acordo com suas necessidades
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
      selectedExposure: selectedExposure.value
    });
    searchResults.value = response.data ? response.data as ViaModel[] : [];
  } catch (error) {
    console.error("Error searching routes:", error);
    // Trate os erros de acordo com suas necessidades
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

.result-table {
  width: 100%;
  border-collapse: collapse;
}

.result-table th, .result-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.result-table th {
  background-color: #d3d3d3;
}
</style>
