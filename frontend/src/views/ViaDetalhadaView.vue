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
        <p><strong>Montanha:</strong> {{ via.montanha_id.nome }}</p>
        <p><strong>Face:</strong> {{ via.face_id.nome }}</p>
        <p><strong>Fonte:</strong> {{ via.fonte_id.autor }}</p>
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
    via.value = await viaService.getViaById(id);
  } catch (error) {
    console.error("Erro ao buscar detalhes da via:", error);
  }
});
</script>
