<template>
  <q-page>
    <BotaoVoltar />
    <CardInfoPrincipal :via="via!" />

    <BotoesAcao
      :via="via"
      :favoriteCollectionId="favoriteCollectionId"
      @update:isFavorited="isFavorited = $event"
    />

    <q-list bordered>
      <SecaoCroqui :via="via" />
      <SecaoMaisDetalhes v-if="via" :via="via" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ViaService from 'src/services/ViaService';
import ColecaoService from 'src/services/ColecaoService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import CardInfoPrincipal from 'components/Via/CardInfoPrincipal.vue';
import BotoesAcao from 'components/Via/BotoesAcao.vue';
import SecaoCroqui from 'components/Via/SecaoCroqui.vue';
import SecaoMaisDetalhes from 'components/Via/SecaoMaisDetalhes.vue';

const route = useRoute();
const via = ref();
const favoriteCollectionId = ref();
const isFavorited = ref(false);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
    const collection = await ColecaoService.getFirstByUsuarioId();
    favoriteCollectionId.value = collection ? collection.id : null;
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
