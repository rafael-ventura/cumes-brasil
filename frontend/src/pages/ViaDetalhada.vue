<template>
  <q-page>
    <!-- Componente Principal com Botão no Topo -->
    <CardInfoPrincipal :via="via!" />

    <!-- Botões de Ação -->
    <BotoesAcao
      :via="via"
      :favoriteCollectionId="favoriteCollectionId"
      @atualizar:isFavorited="isFavorited = $event"
      @acao:escalada="handleAcaoEscalada"
      @acao:favorito="handleAcaoFavorito"
      @acao:colecao="handleAcaoColecao"
    />

    <!-- Lista com Croqui e Detalhes -->
    <q-list bordered>
      <SecaoLocalizacao v-if="via" :via="via" />
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
import SecaoLocalizacao from 'components/Via/SecaoLocalizacao.vue';

const route = useRoute();
const router = useRouter();
const via = ref();
const favoriteCollectionId = ref();
const isFavorited = ref(false);

// Carregar apenas a via, sem dados que exigem autenticação
onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
    console.log('Via carregada:', via.value);
  } catch (error) {
    // não faz nada, deixa o usuário ver a página mesmo sem via
  }
});

// Função para carregar dados que necessitam de autenticação
const carregarDadosAutenticados = async () => {
  // Verifica se o usuário já está autenticado, se não, será redirecionado
  if (await AuthenticateService.redirecionaSeNaoAutenticado(router)) {
    return false;
  }

  try {
    // Carrega a coleção de favoritos apenas quando necessário
    if (!favoriteCollectionId.value) {
      const collection = await ColecaoService.obterColecaoFavoritos();
      favoriteCollectionId.value = collection ? collection.id : null;
    }
    return true;
  } catch (error) {
    console.error('Erro ao carregar dados autenticados:', error);
    return false;
  }
};

// Manipuladores de eventos para as ações
const handleAcaoEscalada = async () => {
  await carregarDadosAutenticados();
};

const handleAcaoFavorito = async () => {
  await carregarDadosAutenticados();
};

const handleAcaoColecao = async () => {
  await carregarDadosAutenticados();
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-list {
  border-radius: 8px;
  border: 1px solid $primary;
  padding: 16px;
  margin-top: 16px;
}

// Desktop
@media (min-width: 768px) {
  .q-list {
    padding: 24px;
    margin-top: 24px;
  }
}
</style>
