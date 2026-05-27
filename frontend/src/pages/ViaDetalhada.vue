<template>
  <q-page>
    <!-- Componente Principal com Botão no Topo -->
    <CardInfoPrincipal v-if="via" :via="via" />
    <div v-else class="estado-carregando-via">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <div class="via-acoes-topo">
      <Button
        icon="pi pi-share-alt"
        aria-label="Compartilhar"
        class="via-share__btn"
        @click="abrirModalCompartilhamento"
      />
      <q-btn
        v-if="estaAutenticado"
        unelevated
        no-caps
        icon="add_photo_alternate"
        label="Adicionar foto"
        class="btn-sugerir-foto"
        @click="modalSugestaoAberto = true"
      />
    </div>

    <!-- Carrossel de fotos colaborativas -->
    <CarrosselFotosVia
      v-if="via"
      ref="carrosselRef"
      :via-id="via.id"
      class="via-carrossel"
    />

    <!-- Botões de Ação -->
    <BotoesAcao
      :via="via"
      :favoriteCollectionId="favoriteCollectionId"
      @atualizar:isFavorited="isFavorited = $event"
      @acao:escalada="aoAcionarEscalada"
      @acao:favorito="aoAcionarFavorito"
      @acao:colecao="aoAcionarColecao"
    />

    <!-- Lista com Croqui e Detalhes -->
    <q-list bordered>
      <SecaoLocalizacao v-if="via" :via="via" />
      <SecaoCroqui v-if="via" :croquis="via.croquis" />
      <SecaoGrau v-if="via" :via="via"/>
      <SecaoMaisDetalhes v-if="via" :via="via" />
    </q-list>
  </q-page>

  <ModalCompartilhamento
    v-model="isModalCompartilhamentoAberto"
    :dados-compartilhamento="dadosCompartilhamento"
  />

  <ModalSugestaoMelhoria
    v-if="via"
    v-model="modalSugestaoAberto"
    :via-id="via.id"
    @enviado="carrosselRef?.recarregar()"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
import { obterUrlCompartilhavel } from 'src/utils/share';
import Button from 'primevue/button';
import ModalCompartilhamento from 'components/Compartilhamento/ModalCompartilhamento.vue';
import ModalSugestaoMelhoria from 'components/Via/ModalSugestaoMelhoria.vue';
import CarrosselFotosVia from 'components/Via/CarrosselFotosVia.vue';

const route = useRoute();
const router = useRouter();
const via = ref();
const favoriteCollectionId = ref();
const isFavorited = ref(false);
const isModalCompartilhamentoAberto = ref(false);
const modalSugestaoAberto = ref(false);
const carrosselRef = ref<InstanceType<typeof CarrosselFotosVia> | null>(null);
const estaAutenticado = AuthenticateService.isTokenValid();

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
const aoAcionarEscalada = async () => {
  await carregarDadosAutenticados();
};

const aoAcionarFavorito = async () => {
  await carregarDadosAutenticados();
};

const aoAcionarColecao = async () => {
  await carregarDadosAutenticados();
};

const sharePreviewUrl = computed(() => {
  if (!via.value?.id) return '';
  return obterUrlCompartilhavel(`/share/via/${via.value.id}`);
});

const dadosCompartilhamento = computed(() => {
  if (!via.value?.id) return null;
  return {
    titulo: via.value?.nome || 'Via no Cumes Brasil',
    texto: 'Veja a via no Cumes Brasil.',
    url: sharePreviewUrl.value
  };
});

function abrirModalCompartilhamento () {
  if (!dadosCompartilhamento.value?.url) return;
  isModalCompartilhamentoAberto.value = true;
}
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-list {
  border-radius: 8px;
  border: 1px solid $primary;
  padding: 16px;
  margin-top: 16px;
}

.via-acoes-topo {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 6px 0 10px;
  padding: 0 16px;
}

.via-carrossel {
  margin: 0 16px 12px;
}

// mantido como alias para compatibilidade
.via-share {
  display: flex;
  justify-content: flex-end;
  margin: 6px 0 10px;
  padding: 0 16px;
}

.via-share__btn {
  background: transparent !important;
  border: 1px solid rgba($cumes-03, 0.45) !important;
  color: $cumes-03 !important;
  width: 38px;
  height: 38px;
  min-width: 38px !important;
  padding: 0 !important;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.via-share__btn :deep(.p-button-icon) {
  font-size: 16px;
}

.btn-sugerir-foto {
  background: rgba($cumes-03, 0.15) !important;
  border: 1px solid rgba($cumes-03, 0.5) !important;
  color: $cumes-03 !important;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: 0 14px !important;
  height: 38px;
}

.estado-carregando-via {
  width: 100%;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba($offwhite, 0.55);

  i {
    font-size: 28px;
    color: $cumes-03;
  }
}

// Desktop
@media (min-width: 768px) {
  .q-list {
    padding: 24px;
    margin-top: 24px;
  }
}
</style>
