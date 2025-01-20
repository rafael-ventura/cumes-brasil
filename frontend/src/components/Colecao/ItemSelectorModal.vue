<template>
  <q-dialog v-model="isOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <ItemSugestao
          :items="items"
          :itemType="itemType"
          @add-item="addItem"
        />
      </q-card-section>
      <q-card-actions align="right" class="card-actions">
        <q-select
          v-model="itemsPerPage"
          :options="itemsPerPageOptions"
          label="Itens por página"
          dense
          outlined
          color="secondary"
          class="items-per-page-select"
          @update:model-value="onItemsPerPageChange"
        />
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          boundary-numbers
          max-pages="5"
          size="md"
          color="secondary"
          text-color="black"
          @update:model-value="onPageChange"
        />
        <q-btn flat label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ItemSugestao from '../ItemSugestao.vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  fetchItems: (page: number, limit: number) => Promise<{ items: any[]; total: number }>;
  addItemToTarget: (itemId: number) => Promise<void>;
  itemType: string;
}>();

const emit = defineEmits(['update:isOpen', 'item-added']);

const isOpen = ref(props.isOpen);
const items = ref<any[]>([]);
const itemsPerPage = ref(6);
const itemsPerPageOptions = ref([6, 10, 20]);
const totalPages = ref(1);
const currentPage = ref(1);

watch(() => props.isOpen, (newVal) => {
  isOpen.value = newVal;
});

watch(isOpen, (newVal) => {
  emit('update:isOpen', newVal);
});

const loadItems = async (page = 1) => {
  try {
    const result = await props.fetchItems(page, itemsPerPage.value);
    items.value = result.items;
    totalPages.value = Math.ceil(result.total / itemsPerPage.value);
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
};

const onItemsPerPageChange = async (newLimit: number) => {
  itemsPerPage.value = newLimit;
  currentPage.value = 1;
  await loadItems(1);
};

const onPageChange = async (page: number) => {
  currentPage.value = page;
  await loadItems(page);
};

const addItem = async (item: any) => {
  try {
    await props.addItemToTarget(item.id);
    emit('item-added', item);
    items.value = items.value.filter(i => i.id !== item.id); // Remove o item já adicionado
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
  }
};

const handleHide = () => {
  emit('update:isOpen', false);
};

const onDialogShow = async () => {
  await loadItems();
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
