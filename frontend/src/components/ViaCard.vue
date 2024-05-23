<template>
  <q-card class="my-card" @click="emitClick">
    <q-card-section>
      <div class="text-h6">{{ props.via.nome }}</div>
      <div class="text-subtitle1">{{ via.montanha.nome }}</div>
    </q-card-section>
    <q-card-section>
      <div>
        <q-badge color="primary"
                 label="Grau: {{ via.grau }}"/>
        <q-badge color="secondary"
                 label="Crux: {{ via.crux }}"
                 class="q-ml-sm"/>
        <q-badge color="info"
                 label="Artificial: {{ via.artificial }}"
                 class="q-ml-sm"/>
        <q-badge color="accent"
                 label="Duração: {{ via.duracao }}"
                 class="q-ml-sm"/>
        <q-badge color="warning"
                 label="Exposição: {{ via.exposicao }}"
                 class="q-ml-sm"/>
      </div>
      <q-badge color="info"
               label="Extensão: {{ via.extensao }}m"
               class="q-mt-sm"/>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Via } from "src/models/Via";

const props = defineProps<{ via: Via }>();
const emits = defineEmits(["click"]);

const emitClick = () => {
  emits("click");
};
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>
