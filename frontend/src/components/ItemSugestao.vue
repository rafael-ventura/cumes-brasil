<template>
  <div>
    <q-input
      v-model="searchQuery"
      :label="searchLabel"
      outlined
      debounce="300"
      class="q-ma-md"
      @input="filterItems"
    />
    <q-list separator>
      <q-item v-for="item in filteredItems" :key="item.id" clickable class="q-pa-xs">
        <q-item-section avatar>
          <q-avatar size="50px">
            <q-img :src="item.imagem?.url || placeholderImage" cover />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.nome }}</q-item-label>
          <q-item-label caption>{{ itemInfo(item) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            :icon="item.added ? 'check' : 'add'"
            :color="item.added ? 'grey' : 'primary'"
            @click.stop="addItem(item)"
            :disabled="item.added"
          />
        </q-item-section>
      </q-item>
      <q-item v-if="!filteredItems.length">
        <q-item-section>
          <q-item-label>Nenhum item encontrado.</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

interface Item {
  id: number;
  nome: string;
  imagem?: { url: string };
  added?: boolean;
  [key: string]: any; // Permite propriedades adicionais
}

const props = defineProps<{
  items: Item[];
  itemType: 'via' | 'colecao';
  placeholderImage?: string;
}>();
const emit = defineEmits(['add-item']);

const searchQuery = ref('');
const filteredItems = ref<Item[]>(props.items);

const placeholderImage = props.placeholderImage || 'https://via.placeholder.com/50';

const searchLabel = props.itemType === 'via' ? 'Buscar vias' : 'Buscar coleções';

const filterItems = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    filteredItems.value = props.items.filter(item =>
      item.nome.toLowerCase().includes(query)
    );
  } else {
    filteredItems.value = props.items;
  }
};

const addItem = (item: Item) => {
  if (!item.added) {
    item.added = true;
    emit('add-item', item);
  }
};

const itemInfo = (item: Item) => {
  if (props.itemType === 'via') {
    return item.montanha?.nome || '';
  } else if (props.itemType === 'colecao') {
    return item.vias?.length ? `${item.vias.length} vias` : '0 vias';
  }
  return '';
};

watch(() => props.items, (newItems) => {
  filteredItems.value = newItems;
});
</script>

<style scoped>
/* Seu estilo aqui */
</style>
