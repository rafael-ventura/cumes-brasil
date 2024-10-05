<template>
  <q-dialog v-model="localIsOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Adicionar Via a uma Coleção</div>
        <ItemSugestao
          :items="vias"
          itemType="via"
          @add-item="addViaToCollection"
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
watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});
watch(localIsOpen, (newVal) => {
  emit('update:isOpen', newVal);
});
const resetVias = () => {
  vias.value = [];
};
const loadViasNotInColecao = async () => {
  try {
    console.log('Loading vias not in coleção', props.colecaoId);
    const result = await ColecaoService.getViasNotIn(props.colecaoId, 1, 10);
    console.log('Result:', result);
    vias.value = result.vias.map(via => ({
      ...via,
      added: false
    }));
  } catch (error) {
    console.error('Erro ao buscar vias:', error);
  }
};

const addViaToCollection = async (via: ViaWithAdded) => {
  try {
    await ColecaoService.addViaToColecao(props.colecaoId, via.id);
    via.added = true;
    // Remover a via da lista após adicionar
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
