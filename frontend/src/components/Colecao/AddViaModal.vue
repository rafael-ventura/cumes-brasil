<template>
  <q-dialog v-model="localIsOpen" @hide="handleHide">
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
import { onMounted, ref, watch } from 'vue';
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

const loadViasNotInColecao = async () => {
  try {
    const result = await ColecaoService.getViasNotIn(props.colecaoId, 1, 10);
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
    await ColecaoService.addViaToColecao(props.colecaoId as number, via.id);
    via.added = true;
    emit('via-added', via);
  } catch (error) {
    console.error('Erro ao adicionar via à coleção:', error);
  }
};

const handleHide = () => {
  emit('update:isOpen', false);
};

onMounted(() => {
  if (props.isOpen) {
    loadViasNotInColecao();
  }
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadViasNotInColecao();
  }
});
</script>

<style scoped>
.q-dialog-plugin {
  min-width: 400px;
}
</style>
