<template>
  <q-page class="q-pa-md">
    <BotaoVoltar/>
    <div>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ via?.nome }}</div>
          <div class="text-subtitle2">{{ via?.montanha.nome }}</div>
        </q-card-section>
        <q-card-section>
          <p><strong>Grau:</strong> {{ via?.grau }}</p>
          <p><strong>Crux:</strong> {{ via?.crux }}</p>
          <p><strong>Artificial:</strong> {{ via?.artificial }}</p>
          <p><strong>Duração:</strong> {{ via?.duracao }}</p>
          <p><strong>Exposição:</strong> {{ via?.exposicao }}</p>
          <p><strong>Extensão:</strong> {{ via?.extensao }}m</p>
          <p><strong>Conquistadores:</strong> {{ via?.conquistadores }}</p>
          <p><strong>Detalhes:</strong> {{ via?.detalhes }}</p>
          <p><strong>Data:</strong> {{ via?.data }}</p>
          <p><strong>montanha:</strong> {{ via?.montanha.nome }}</p>
          <p><strong>Face:</strong> {{ via?.face.nome }}</p>
          <p><strong>Fonte:</strong> {{ via?.fonte.autor }}</p>
        </q-card-section>

        <q-separator />
        <q-card-actions vertical align="left">
          <q-btn flat @click="toggleForm">Criar Escalada</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>

  <!-- Testar passar como propriedade o showForm e utilizar o v-show a partir dele -->
  <ModalCriarEscalada :isOpen="showForm" @update:isOpen="showForm = $event"/>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ViaService from "src/services/ViaService";
import BotaoVoltar from "components/BotaoVoltar.vue";
import ModalCriarEscalada from "components/Escalada/ModalCriarEscalada.vue";
import { Via } from "src/models/Via";

const route = useRoute();
const via = ref<Via>();
const showForm = ref(false);

defineOptions({
  name: "ViaDetalhadaPage"
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
  } catch (error) {
    console.error("Erro ao buscar detalhes da via:", error);
  }
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

</script>
