<template>
  <q-dialog v-model="isOpen" @hide="handleHide" @show="onDialogShow">
    <q-card class="q-dialog-plugin">
      <q-card-section class="title-section">
        <div class="title-text">{{ title }}</div>
      </q-card-section>
      <q-card-section>
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
  fetchItems:(page: number, limit: number) => Promise<{ items: any[]; total: number }>;
  addItemToTarget: (itemId: number) => Promise<void>;
  itemType: 'via' | 'colecao';
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
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: $background; /* Fundo geral */
  border-radius: 10px;
}

.title-section {
  background-color: $cumes-03; /* Cor de destaque para o título */
  color: white;
  padding: 2.5rem 16px 16px;
  border-top-left-radius: 10px; /* Bordas arredondadas integrando ao card */
  border-top-right-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra leve */
  text-align: center;
}

.title-text {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -0.4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 0.2rem;
  background-color: white;
  border-radius: 5px;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .q-pagination {
    flex-grow: 1;
    margin-left: 16px;
    font-size: 0.9rem; /* Ajusta tamanho da fonte */
    color: $cumes-01; /* Usa cor padrão */
  }

  .items-per-page-select {
    width: 130px;
    border: 1px solid $cumes-01; /* Borda com cor padrão */
    border-radius: 5px;
  }

  .q-btn {
    color: $cumes-03;
    border: 1px solid $cumes-03; /* Borda com cor do botão */
    background-color: transparent;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1); /* Fundo leve no hover */
    }
  }
}

.item-sugestao-container {
  background-color: $background;
  padding: 16px;
  border-radius: 0 0 10px 10px; /* Faz o container parecer integrado ao título */
}

</style>
