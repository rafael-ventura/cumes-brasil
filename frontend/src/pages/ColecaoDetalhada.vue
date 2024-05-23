<template>
  <q-page class="q-pa-md">
    <BotaoVoltar/>
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ colecao?.nome }}</div>
      </q-card-section>
    </q-card>
    <ViaLista :vias="vias"/>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Via } from "src/models/Via";
import { Colecao } from "src/models/Colecao";
import ColecaoService from "src/services/colecaoService";
import BotaoVoltar from "components/BotaoVoltar.vue";
import ViaLista from "components/ViaLista.vue";

const route = useRoute();
const vias = ref<Via[]>([]);
const colecao = ref<Colecao | null>(null);

defineOptions({
  name: "ColecaoDetalhadaPage"
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    const colecaoData = await ColecaoService.getColecaoById(id);
    colecao.value = colecaoData;
    vias.value = colecaoData.vias;
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleção:", error);
  }
});
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}

.q-mb-md {
  margin-bottom: 16px;
}
</style>
