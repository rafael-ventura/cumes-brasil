<template>
  <q-dialog v-model="dialogOpen" @hide="handleHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Adicionar a uma Coleção</div>
        <q-input v-model="searchQuery" label="Buscar coleções" @input="searchCollections" debounce="300" />
        <ColecaoSugestao :colecoes="suggestedCollections" @add-colecao="addCollection" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn v-if="currentPage < totalPages" @click="loadMoreCollections" label="Carregar mais" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import ColecaoSugestao from 'components/Via/ColecaoSugestao.vue';

const props = defineProps<{ isOpen: boolean; viaId: number }>();
const emit = defineEmits(['update:isOpen', 'colecao-added']);

const searchQuery = ref('');
const suggestedCollections = ref<Colecao[]>([]);
const dialogOpen = ref(props.isOpen);
const currentPage = ref(1);
const totalPages = ref(1);

const resetPagination = () => {
  currentPage.value = 1;
  suggestedCollections.value = [];
};

const loadCollections = async () => {
  const result = await ColecaoService.getCollecoesNotContainingVia(props.viaId, currentPage.value, 10);
  suggestedCollections.value = currentPage.value === 1 ? result.colecoes : [...suggestedCollections.value, ...result.colecoes];
  totalPages.value = Math.ceil(result.total / 10);
};

const searchCollections = async () => {
  resetPagination();
  if (searchQuery.value.trim()) {
    const result = await ColecaoService.getCollecoesNotContainingVia(props.viaId, 1, 10);
    suggestedCollections.value = result.colecoes.filter(colecao =>
      colecao.nome.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    );
  } else {
    await loadCollections();
  }
};

const loadMoreCollections = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadCollections();
  }
};

const addCollection = async (colecao: Colecao) => {
  try {
    await ColecaoService.addViaToColecao(colecao.id, props.viaId);
    emit('colecao-added', colecao);
  } catch (error) {
    console.error('Erro ao adicionar via à coleção:', error);
  }
};

const handleHide = () => {
  dialogOpen.value = false;
  emit('update:isOpen', false);
};

watch(() => props.isOpen, (newValue) => {
  dialogOpen.value = newValue;
  if (newValue) {
    resetPagination();
    loadCollections();
  }
});

watch(dialogOpen, (newValue) => {
  if (!newValue) {
    emit('update:isOpen', false);
  }
});

onMounted(() => {
  if (props.isOpen) {
    resetPagination();
    loadCollections();
  }
});
</script>

<style scoped>
.q-dialog-plugin {
  height: 60%;
}
</style>
