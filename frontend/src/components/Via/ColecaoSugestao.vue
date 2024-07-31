<template>
  <q-list bordered separator>
    <q-item v-for="colecao in props.colecoes" :key="colecao.id" clickable @click="addCollection(colecao)">
      <q-item-section>
        <q-item-label>{{ colecao.nome }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          flat
          round
          :icon="colecao.added ? 'check' : 'add'"
          :color="colecao.added ? 'green' : 'primary'"
          @click.stop="addCollection(colecao)"
          :disabled="colecao.added" />
      </q-item-section>
    </q-item>
    <q-item v-if="!props.colecoes.length">
      <q-item-section>
        <q-item-label>Nenhuma coleção encontrada.</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { Colecao } from 'src/models/Colecao';

interface ColecaoWithAdded extends Colecao {
  added?: boolean;
}

const props = defineProps<{ colecoes: ColecaoWithAdded[] }>();
const emit = defineEmits(['add-colecao']);

const addCollection = (colecao: ColecaoWithAdded) => {
  if (!colecao.added) {
    colecao.added = true;
    emit('add-colecao', colecao);
  }
};
</script>

<style scoped>
</style>
