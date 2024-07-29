<template>
  <q-page class="q-pa-sm">
    <BotaoVoltar />
    <div class="text-h2 q-mb-md title-margin">{{ via?.nome }}</div>
    <div class="text-subtitle1 q-mb-md title-margin">{{ via?.montanha.nome }}, {{ via?.face.nome }}</div>
    <q-separator spaced />

    <!-- Botões de ação -->
    <div class="action-buttons q-col-12">
      <q-btn rounded color="primary" icon="add_circle" @click="toggleForm">
        <div>Registrar uma escalada</div>
      </q-btn>
      <q-btn rounded color="secondary" icon="star_border" @click="addToFavorites">
        <div>Adicionar a Favoritas</div>
      </q-btn>
      <q-btn rounded color="accent" icon="style" @click="openAddToCollectionModal">
        <div>Adicionar a uma Coleção</div>
      </q-btn>
    </div>

    <div class="row q-col-gutter-none">
      <!-- Bloco Imagem da Via -->
      <div class="col-12">
        <CardImagem :src="via?.imagem?.url || adjustImageUrl('/assets/default-via.jpg')" />
      </div>

      <!-- Bloco Duração, Extensão, Data da Conquista e Conquistadores -->
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Duração:</strong> {{ via?.duracao }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Extensão:</strong> {{ via?.extensao }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Data da Conquista:</strong> {{ via?.data }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Conquistadores:</strong> {{ via?.conquistadores }}</p>
        </CardDetalhe>
      </div>

      <!-- Bloco Grau, Crux, Artificial e Exposição -->
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Grau:</strong> {{ via?.grau }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Crux:</strong> {{ via?.crux }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Artificial:</strong> {{ via?.artificial }}</p>
        </CardDetalhe>
      </div>
      <div class="col-6 col-md-3">
        <CardDetalhe>
          <p><strong>Exposição:</strong> {{ via?.exposicao }}</p>
        </CardDetalhe>
      </div>

      <!-- Bloco Detalhes, Fonte e Referência da Fonte -->
      <div class="col-12">
        <CardDetalhe>
          <p><strong>Detalhes:</strong> {{ via?.detalhes }}</p>
        </CardDetalhe>
      </div>
      <div class="col-12">
        <CardDetalhe>
          <p><strong>Fonte:</strong> {{ via?.fonte.autor }}</p>
        </CardDetalhe>
      </div>
      <div class="col-12">
        <CardDetalhe>
          <p><strong>Referência da Fonte:</strong> {{ via?.fonte.referencia }}</p>
        </CardDetalhe>
      </div>

      <!-- Bloco Croquis -->
      <div class="col-12">
        <CardDetalhe>
          <p><strong>Croquis:</strong></p>
          <CarrosselCroquis :croquis="via?.croquis" />
        </CardDetalhe>
      </div>
    </div>

    <!-- Modal para registrar uma nova escalada dessa via -->
    <ModalCriarEscalada :isOpen="showForm" @update:isOpen="showForm = $event"/>

    <!-- Modal para adicionar via a coleções -->
    <ModalAddToCollection
      :isOpen="showAddToCollectionModal"
      :viaId="<number>via?.id"
      @update:isOpen="showAddToCollectionModal = $event"
      @colecao-added="handleColecaoAdded"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ViaService from 'src/services/ViaService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import CardDetalhe from 'components/Via/CardDetalhe.vue';
import CardImagem from 'components/Via/CardImagem.vue';
import { Via } from 'src/models/Via';
import CarrosselCroquis from 'components/Croquis/CarrosselCroquis.vue';
import { adjustImageUrl } from 'src/services/ImagemService';
import AuthenticateService from 'src/services/AuthenticateService';
import ModalAddToCollection from 'components/Via/AddColecaoModal.vue';
import { Colecao } from 'src/models/Colecao';

const route = useRoute();
const router = useRouter();
const via = ref<Via>();
const showForm = ref(false);
const showAddToCollectionModal = ref(false);

defineOptions({
  name: 'ViaDetalhadaPage'
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
    console.log('Detalhes da via:', via.value);
    console.log('Croquis:', via.value?.croquis);
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error);
  }
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const addToFavorites = async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      router.push('/auth/login');
    } else {
      await ViaService.addToFavorites(Number(route.params.id));
      Notify.create({
        type: 'positive',
        message: 'Via adicionada a favoritos com sucesso!',
        position: 'top-right',
        timeout: 3000
      });
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro desconhecido';
    Notify.create({
      type: 'negative',
      message: 'Erro ao adicionar a favoritos: ' + errorMessage,
      position: 'top-right',
      timeout: 3000
    });
    console.error('Erro ao adicionar a favoritos:', error);
  }
};

const openAddToCollectionModal = () => {
  showAddToCollectionModal.value = true;
};

const handleColecaoAdded = (colecao: Colecao) => {
  Notify.create({
    type: 'positive',
    message: `Via adicionada à coleção ${colecao.nome} com sucesso!`,
    position: 'top-right',
    timeout: 3000
  });
};
</script>

<style scoped>
.title-margin {
  margin-left: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
