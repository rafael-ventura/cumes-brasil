<template>
  <q-page>
    <!-- Componente Principal com Botão no Topo -->
    <CardInfoPrincipal :via="via!" />

    <!-- Botões de Ação -->
    <BotoesAcao
      :via="via"
      :favoriteCollectionId="favoriteCollectionId"
      @update:isFavorited="isFavorited = $event"
    />

    <!-- Lista com Croqui e Detalhes -->
    <q-list bordered>
      <SecaoCroqui v-if="via" :croquis="via.croquis" />
      <SecaoGrau v-if="via" :via="via"/>
      <SecaoMaisDetalhes v-if="via" :via="via" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ViaService from 'src/services/ViaService';
import ColecaoService from 'src/services/ColecaoService';
import CardInfoPrincipal from 'components/Via/CardInfoPrincipal.vue';
import BotoesAcao from 'components/Via/BotoesAcao.vue';
import SecaoCroqui from 'components/Via/SecaoCroqui.vue';
import SecaoMaisDetalhes from 'components/Via/SecaoMaisDetalhes.vue';
import AuthenticateService from 'src/services/AuthenticateService';
import SecaoGrau from 'components/Via/SecaoGrau.vue';

const route = useRoute();
const router = useRouter();
const via = ref();
const favoriteCollectionId = ref();
const isFavorited = ref(false);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
    const collection = await ColecaoService.obterColecaoFavoritos();
    favoriteCollectionId.value = collection ? collection.id : null;
  } catch (error) {
    // nao faz nada
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
