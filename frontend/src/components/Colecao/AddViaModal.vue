<template>
  <ItemSelectorModal
    :isOpen="localIsOpen"
    title="Adicionar Via a uma Coleção"
    :fetchItems="fetchViasNotInColecao"
    :addItemToTarget="adicionarViaNaColecao"
    itemType="via"
    @update:isOpen="localIsOpen = $event"
    @item-added="onViaAdded"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Via } from 'src/models/Via';
import ItemSelectorModal from 'components/Colecao/ItemSelectorModal.vue';

const props = defineProps<{ isOpen: boolean; colecaoId: number }>();
const emit = defineEmits(['update:isOpen', 'via-added']);
const localIsOpen = ref(props.isOpen);

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue;
  },
  { immediate: true }
);

const fetchViasNotInColecao = async (page: number, limit: number) => {
  try {
    const result = await ColecaoService.listarViasForaDaColecao(props.colecaoId, page, limit);
    return {
      items: result.vias,
      total: result.total
    };
  } catch (error) {
    console.error('Erro ao buscar vias:', error);
    return {
      items: [],
      total: 0
    };
  }
};

const adicionarViaNaColecao = async (viaId: number) => {
  try {
    await ColecaoService.adicionarViaNaColecao(props.colecaoId, viaId);
  } catch (error) {
    console.error('Erro ao adicionar via à coleção:', error);
    throw error;
  }
};

const onViaAdded = (via: Via) => {
  emit('via-added', via);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.q-dialog-plugin {
  min-width: 400px;
  max-height: 450px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .q-pagination {
    flex-grow: 1;
    margin-left: 16px;
  }

  .items-per-page-select {
    width: 120px;
  }

  .q-btn {
    color: $cumes-03;
    background-color: transparent;
  }
}
</style>
