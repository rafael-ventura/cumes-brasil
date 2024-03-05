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
        <option v-for="difficulty in difficulties" :key="difficulty">{{ difficulty }}</option>
      </select>

      <!-- Botão para iniciar a busca -->
      <button @click="search">Buscar</button>
    </div>

    <!-- Tabela para exibir os resultados da busca -->
    <table class="result-table">
      <thead>
      <tr>
        <th>Nome da Via</th>
        <th>Montanha</th>
        <th>Grau de Dificuldade</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="via in searchResults" :key="via.id" @click="showDetails(via)">
        <td>{{ via.name }}</td>
        <td>{{ via.mountain }}</td>
        <td>{{ via.difficulty }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import viaService from "@/services/viaService";

const searchQuery = ref('');
const selectedMountain = ref('');
const selectedDifficulty = ref('');
const searchResults = ref([]);
const selectedExposure = ref('');

const search = async () => {
  try {
    const response = await viaService.searchVias({
      searchQuery: searchQuery.value,
      selectedMountain: selectedMountain.value,
      selectedDifficulty: selectedDifficulty.value,
      selectedExposure: selectedExposure.value
    });
    searchResults.value = response.data;
  } catch (error) {
    console.error('Error searching routes:', error);
    // Trate os erros de acordo com suas necessidades
  }
};

const showDetails = (via) => {
  // Lógica para exibir detalhes da via
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
  background-color: #f2f2f2;
}
</style>
