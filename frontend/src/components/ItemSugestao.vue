<template>
  <div @scroll="onScroll" class="item-sugestao-container">
    <!-- Campo de busca unificada -->
    <q-input
      v-model="unifiedSearch"
      label="Buscar por nome, bairro ou montanha"
      outlined
      label-color="primary"
      color="primary"
      debounce="300"
      class="search-input"
      @input="onInputChange"
    />
    <q-list separator>
      <q-item v-for="item in filteredItems" :key="item.id" clickable class="q-pa-xs item-card">
        <q-item-section avatar>
          <q-avatar size="50px">
            <q-img :src="item.imagem?.url || placeholderImage" cover />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="item-label-primary">{{ item.nome }}</q-item-label>
          <q-item-label caption class="item-caption">{{ itemInfo(item) }}</q-item-label>
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
      <!-- Mensagem de carregando mais itens -->
      <q-item v-if="loadingMore" class="loading-item">
        <q-item-section>
          <q-item-label>Carregando mais itens...</q-item-label>
        </q-item-section>
      </q-item>
      <!-- Mensagem se não houver resultados -->
      <q-item v-if="!filteredItems.length && !loadingMore" class="no-results">
        <q-item-section>
          <q-item-label>Nenhum item encontrado.</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue';

interface Item {
  id: number;
  nome: string;
  imagem?: { url: string };
  montanha?: { nome: string; bairro: string };
  added?: boolean;
  [key: string]: any;
}

const props = defineProps<{
  items: any[];
  itemType: 'via' | 'colecao';
  placeholderImage?: string;
  loadMoreItems?:() => Promise<void>;
}>();
const emit = defineEmits(['add-item']);

// Estados locais
const unifiedSearch = ref('');
const placeholderImage = props.placeholderImage || 'https://via.placeholder.com/50';
const loadingMore = ref(false);

// Lógica de filtragem unificada
const filteredItems = computed(() => {
  const query = unifiedSearch.value.trim().toLowerCase();
  if (query) {
    return props.items.filter(item => {
      return (
        item.nome.toLowerCase().includes(query) ||
        (item.montanha?.nome?.toLowerCase().includes(query)) ||
        (item.montanha?.bairro?.toLowerCase().includes(query))
      );
    });
  } else {
    return props.items;
  }
});

// Método para manipular a entrada do campo de busca
const onInputChange = (value: string) => {
  unifiedSearch.value = value;
};

// Função para adicionar item
const addItem = (item: Item) => {
  if (!item.added) {
    item.added = true;
    emit('add-item', item);
  }
};

// Função para exibir informações do item
const itemInfo = (item: Item) => {
  if (props.itemType === 'via') {
    return item.montanha?.nome || '';
  } else if (props.itemType === 'colecao') {
    return item.vias?.length ? `${item.vias.length} vias` : '0 vias';
  }
  return '';
};

// Lógica de carregamento infinito
const onScroll = async (event: Event) => {
  const target = event.target as HTMLElement;

  if (
    target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
    !loadingMore.value &&
    props.loadMoreItems
  ) {
    loadingMore.value = true;
    await props.loadMoreItems();
    loadingMore.value = false;
  }
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.item-sugestao-container {
  max-height: 700px;
  background-color: $dark;
  border-radius: 10px;
}

.search-input {
  margin-bottom: 16px;

  .q-field__label,
  .q-field__native {
    color: $primary;
  }
}

.item-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  padding: 1%;

  .q-item__section {
    color: $primary;
  }
}

.item-label-primary {
  color: $primary;
  font-weight: bold;
}

.item-caption {
  color: $primary;
}

.icon-primary {
  color: $primary;
}

.loading-item,
.no-results {
  text-align: center;
  color: $primary;
}
</style>
