<template>
  <q-dialog v-model="localIsOpen" @hide="handleHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Adicionar a uma Coleção</div>
        <ItemSugestao
          :items="colecoes"
          itemType="colecao"
          @add-item="addCollection"
        />
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
import ItemSugestao from './ItemSugestao.vue';

interface ColecaoWithAdded extends Colecao {
  added?: boolean;
}

const props = defineProps<{ isOpen: boolean; viaId: number }>();
const emit = defineEmits(['update:isOpen', 'colecao-added']);

const colecoes = ref<ColecaoWithAdded[]>([]);
const localIsOpen = ref(props.isOpen);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');

watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});

watch(localIsOpen, (newVal) => {
  emit('update:isOpen', newVal);
});

const resetPagination = () => {
  currentPage.value = 1;
  colecoes.value = [];
};

const loadCollections = async () => {
  try {
    const result = await ColecaoService.getCollecoesNotContainingVia(props.viaId, currentPage.value, 10);
    colecoes.value = result.colecoes.map(colecao => ({
      ...colecao,
      added: false
    }));
    totalPages.value = Math.ceil(result.total / 10);
  } catch (error) {
    console.error('Erro ao carregar coleções:', error);
  }
};

const loadMoreCollections = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadCollections();
  }
};

const addCollection = async (colecao: ColecaoWithAdded) => {
  try {
    await ColecaoService.addViaToColecao(colecao.id, props.viaId);
    colecao.added = true;
    emit('colecao-added', colecao);
  } catch (error) {
    console.error('Erro ao adicionar via à coleção:', error);
  }
};

const handleHide = () => {
  emit('update:isOpen', false);
};

onMounted(() => {
  if (props.isOpen) {
    resetPagination();
    loadCollections();
  }
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
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
