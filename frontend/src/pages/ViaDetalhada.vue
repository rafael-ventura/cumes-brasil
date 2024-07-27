<template>
  <q-page class="q-pa-sm">
    <BotaoVoltar/>
    <div class="text-h2 q-mb-md title-margin">{{ via?.nome }}</div>
    <div class="text-subtitle1 q-mb-md title-margin">{{ via?.montanha.nome }}, {{ via?.face.nome }}</div>
    <div class="row q-col-gutter-none">

      <!-- Bloco Duração e Extensão -->
      <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <p><strong>Duração:</strong> {{ via?.duracao }}</p>
            <p><strong>Extensão:</strong> {{ via?.extensao }}</p>
          </q-card-section>
        </q-card>
      </div>
      <!-- Bloco Grau, Crux, Artificial e Exposição -->
      <div class="col-xs-6 col-sm-3 col-md-3 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <p><strong>Grau:</strong> {{ via?.grau }}</p>
            <p><strong>Crux:</strong> {{ via?.crux }}</p>
            <p><strong>Artificial:</strong> {{ via?.artificial }}</p>
            <p><strong>Exposição:</strong> {{ via?.exposicao }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bloco Detalhes -->
      <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8 col-xl-8">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <p><strong>Detalhes:</strong> {{ via?.detalhes }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bloco Fonte e Conquistadores -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <p><strong>Fonte:</strong> {{ via?.fonte.autor }}</p>
            <p><strong>Conquistadores:</strong> {{ via?.conquistadores }}</p>
            <p><strong>Referência da Fonte:</strong> {{ via?.fonte.referencia }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bloco Data -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <p><strong>Data do cadastro:</strong> {{ via?.data }}</p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Bloco Croquis -->
      <div class="col-12">
        <q-card class="q-ma-md bg-grey-3 rounded-borders">
          <q-card-section>
            <!-- Placeholder para o carrossel de fotos -->
            <p><strong>Croquis:</strong></p>
            <CarrosselCroquis :croquis="via?.croquis" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ViaService from "src/services/ViaService";
import BotaoVoltar from "components/BotaoVoltar.vue";
import { Via } from "src/models/Via";
import CarrosselCroquis from "components/Croquis/CarrosselCroquis.vue";

const route = useRoute();
const via = ref<Via>();

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
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}

.title-margin {
  margin-left: 20px;
}

</style>
