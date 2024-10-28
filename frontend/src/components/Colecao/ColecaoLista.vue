<template>
  <div>
    <div class="colecao-list">
      <ColecaoCard v-for="colecao in props.colecoes" :key="colecao.id" :colecao="colecao" @click="showDetails(colecao)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import ColecaoCard from 'components/Colecao/ColecaoCard.vue';
import { Colecao } from 'src/models/Colecao';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{ colecoes: Colecao[] }>();

const showDetails = (colecao: Colecao) => {
  // Função de navegação para a página de detalhes da coleção
  router.push(`/colecoes/${colecao.id}`);
};
</script>

<style scoped>
.colecao-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
