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
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
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

const localIsOpen = ref(props.isOpen);
const colecoes = ref<ColecaoWithAdded[]>([]);

watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});

watch(localIsOpen, (newVal) => {
  emit('update:isOpen', newVal);
});

const loadColecoesNotContainingVia = async () => {
  try {
    const result = await ColecaoService.getCollecoesNotContainingVia(props.viaId, 1, 10);
    colecoes.value = result.colecoes.map(colecao => ({
      ...colecao,
      added: false
    }));
  } catch (error) {
    console.error('Erro ao buscar coleções:', error);
  }
};

const addCollection = async (colecao: ColecaoWithAdded) => {
  try {
    await ColecaoService.addViaToColecao(colecao.id, props.viaId);
    colecao.added = true;
    // Remover a coleção da lista após adicionar
    colecoes.value = colecoes.value.filter(c => c.id !== colecao.id);
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
    loadColecoesNotContainingVia();
  }
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadColecoesNotContainingVia();
  }
});
</script>

<style scoped>
.q-dialog-plugin {
  min-width: 400px;
}
</style>
