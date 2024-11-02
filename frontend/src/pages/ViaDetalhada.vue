<template>
  <q-page class="q-pa-sm">
    <BotaoVoltar />
    <CardInfoPrincipal :via="via" />
    <BotoesAcao :onRegister="toggleForm" :onAddFavorite="addToFavorites" :onAddCollection="openAddToCollectionModal" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ViaService from 'src/services/ViaService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import CardInfoPrincipal from 'components/Via/CardInfoPrincipal.vue';
import BotoesAcao from 'components/Via/BotoesAcao.vue';
import { Notify } from 'quasar';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';

const route = useRoute();
const router = useRouter();
const via = ref();
const colecoes = ref<Colecao[]>([]); // Define colecoes como Colecao[]
const showForm = ref(false);
const showAddToCollectionModal = ref(false);

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error);
  }
});

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const addToFavorites = async () => {
  try {
    await ViaService.addToFavorites(Number(route.params.id));
    Notify.create({
      type: 'positive',
      message: 'Via adicionada a favoritos com sucesso!',
      position: 'top-right',
      timeout: 3000
    });
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Erro desconhecido',
      position: 'top-right',
      timeout: 3000
    });
  }
};

const loadColecoesNotContainingVia = async () => {
  if (via.value) {
    try {
      const result = await ColecaoService.getCollecoesNotContainingVia(via.value.id, 1, 10);
      colecoes.value = result.colecoes;
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  }
};

const openAddToCollectionModal = async () => {
  showAddToCollectionModal.value = true;
  await loadColecoesNotContainingVia();
};
</script>
