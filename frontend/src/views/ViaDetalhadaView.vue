<template>
  <div v-if="via">
    <v-card>
      <v-card-title>{{ via.nome }}</v-card-title>
      <v-card-text>
        <p><strong>Grau:</strong> {{ via.grau }}</p>
        <p><strong>Crux:</strong> {{ via.crux }}</p>
        <p><strong>Artificial:</strong> {{ via.artificial }}</p>
        <p><strong>Duração:</strong> {{ via.duracao }}</p>
        <p><strong>Exposição:</strong> {{ via.exposicao }}</p>
        <p><strong>Extensão:</strong> {{ via.extensao }}</p>
        <p><strong>Conquistadores:</strong> {{ via.conquistadores.join(', ') }}</p>
        <p><strong>Detalhes:</strong> {{ via.detalhes }}</p>
        <p><strong>Data:</strong> {{ via.data }}</p>
        <p><strong>Montanha ID:</strong> {{ via.montanha_id }}</p>
        <p><strong>Face ID:</strong> {{ via.face_id }}</p>
        <p><strong>Via Principal ID:</strong> {{ via.via_principal_id }}</p>
        <p><strong>Fonte ID:</strong> {{ via.fonte_id }}</p>
        <!-- Aqui você pode adicionar os detalhes adicionais conforme necessário -->
      </v-card-text>
    </v-card>
  </div>
  <div v-else>
    <p>Carregando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import viaService from "@/services/viaService";
import { useRoute } from "vue-router";

const route = useRoute();
const via = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id; // assume que o ID da via está presente nos parâmetros de rota
    const response = await viaService.getById(id);
    via.value = response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da via:", error);
  }
});
</script>
