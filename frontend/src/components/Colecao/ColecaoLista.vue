<template>
  <div>
    <div class="colecao-list">
      <ColecaoCard v-for="colecao in props.colecoes" :key="colecao.id" :colecao="colecao" @click="showDetails(colecao)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ColecaoCard from 'components/Colecao/ColecaoCard.vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{ colecoes: IColecao[] }>();

const showDetails = (colecao: IColecao) => {
  router.push(`/colecoes/${colecao.id}`);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.colecao-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    padding: 24px;
  }
}
</style>
