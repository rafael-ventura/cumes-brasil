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
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{ colecoes: IColecao[] }>();

const showDetails = (colecao: IColecao) => {
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
