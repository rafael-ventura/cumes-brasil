<template>
  <q-dialog v-model="localIsOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Adicionar Via a uma Coleção</div>
        <ItemSugestao
          :items="vias"
          itemType="via"
          @add-item="addViaToCollection"
          :loadMoreItems="loadMoreVias"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Via } from 'src/models/Via';
import ColecaoService from 'src/services/ColecaoService';
import ItemSugestao from '../ItemSugestao.vue';

interface ViaWithAdded extends Via {
  added?: boolean;
}

const props = defineProps<{ isOpen: boolean; colecaoId: number }>();
const emit = defineEmits(['update:isOpen', 'via-added']);
const localIsOpen = ref(props.isOpen);
const vias = ref<ViaWithAdded[]>([]);
const currentPage = ref(1);
const loadingMore = ref(false); // Controle de carregamento

watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});

watch(localIsOpen, (newVal) => {
  emit('update:isOpen', newVal);
});

const resetVias = () => {
  vias.value = [];
  currentPage.value = 1; // Resetar a página atual
};

const loadViasNotInColecao = async (page = 1) => {
  try {
    const result = await ColecaoService.getViasNotIn(props.colecaoId, page, 10);
    const novasVias = result.vias.map(via => ({
      ...via,
      added: false
    }));

    // Adiciona as novas vias à lista existente
    vias.value = page === 1 ? novasVias : [...vias.value, ...novasVias];
    console.log('Vias:', vias.value);
  } catch (error) {
    console.error('Erro ao buscar vias:', error);
  }
};

// Função para carregar mais vias
const loadMoreVias = async () => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  currentPage.value += 1; // Incrementar a página
  await loadViasNotInColecao(currentPage.value); // Carregar mais vias
  loadingMore.value = false;
};

const addViaToCollection = async (via: ViaWithAdded) => {
  try {
    await ColecaoService.addViaToColecao(props.colecaoId, via.id);
    via.added = true;
    vias.value = vias.value.filter(v => v.id !== via.id);
    emit('via-added', via);
  } catch (error) {
    console.error('Erro ao adicionar via à coleção:', error);
  }
};

const handleHide = () => {
  emit('update:isOpen', false);
};

const onDialogShow = async () => {
  resetVias();
  await loadViasNotInColecao();
};
</script>

<style scoped>
.q-dialog-plugin {
  min-width: 400px;
}
</style>
