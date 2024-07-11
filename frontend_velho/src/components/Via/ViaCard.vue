<template>
  <q-card class="card-item" @click="emitClick">
    <q-card-section>
      <img :src="via.imagem.url" class="card-image" alt="via image"/>
      <div class="card-info">
        <div class="text-h6">{{ via.nome }}</div>
        <div class="text-subtitle1">{{ via.montanha.nome }}</div>
        <q-badge color="primary" :label="'Grau: ' + via.grau"/>
        <q-badge color="secondary" :label="'Crux: ' + via.crux" class="q-ml-sm"/>
        <q-badge color="info" :label="'Artificial: ' + via.artificial" class="q-ml-sm"/>
        <q-badge color="accent" :label="'Duração: ' + via.duracao" class="q-ml-sm"/>
        <q-badge color="warning" :label="'Exposição: ' + via.exposicao" class="q-ml-sm"/>
        <q-badge color="info" :label="'Extensão: ' + via.extensao + 'm'" class="q-mt-sm"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { Via } from "src/models/Via";

const props = defineProps<{ via: Via }>();
const emits = defineEmits(["click"]);

const emitClick = () => {
  emits("click");
};
</script>
