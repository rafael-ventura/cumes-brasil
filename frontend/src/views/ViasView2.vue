<!-- ViasView2.vue -->
<template>
  <div>
    <v-card flat title="Vias de Escalada - Versão 2">
      <v-data-table :headers="headers" :items="vias"></v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import viaService from "@/services/viaService";

const headers = [
  { title: "Nome", key: "nome" },
  { title: "Artificial", key: "artificial" },
  { title: "Extensão (m)", key: "extensao" },
  { title: "Exposição", key: "exposicao" },
  { title: "Grau", key: "grau" }
];
const vias = ref([]);

onMounted(async () => {
  try {
    const response = await viaService.getAll();
    if (response) {
      console.log("Dados obtidos:", response);
      vias.value = response;
    } else {
      console.error("Dados não encontrados na resposta da API");
    }
  } catch (error) {
    console.error("Erro ao obter lista de vias:", error);
  }
});
</script>
