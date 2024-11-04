<template>
  <q-page>
    <BotaoVoltar />
    <CardInfoPrincipal :via="via!" />

    <!-- Componente de Botões de Ação, com todos os controles -->
    <BotoesAcao
      :via="via"
      :favoriteCollectionId="favoriteCollectionId"
      @update:isFavorited="isFavorited = $event"
    />

    <q-list bordered>
      <!-- Seção Croquis com carrossel como dropdown -->
      <SecaoCroqui :via="via" />
      <!-- Seção com mais detalhes da via -->
      <SecaoMaisDetalhes v-if="via" :via="via" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ViaService from 'src/services/ViaService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import CardInfoPrincipal from 'components/Via/CardInfoPrincipal.vue';
import BotoesAcao from 'components/Via/BotoesAcao.vue';
import SecaoCroqui from 'components/Via/SecaoCroqui.vue';
import { Via } from 'src/models/Via';
import SecaoMaisDetalhes from 'components/Via/SecaoMaisDetalhes.vue';

const route = useRoute();

const via = ref<Via | null>(null);
const favoriteCollectionId = ref<number | null>(null);
const isFavorited = ref(false);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error);
  }
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-list {
  border-radius: 8px;
  border: 1px solid $primary;
  padding: 1%;
}
</style>
