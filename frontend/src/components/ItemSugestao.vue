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
    <q-list>
      <q-item v-for="item in filteredItems" :key="item.id" clickable class="item-card">
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
import { computed, defineProps, ref } from 'vue';

interface Item {
  id: number;
  nome: string;
  imagem?: { url: string };
  montanha?: { nome: string; bairro: string };
  added?: boolean;
  lentgh?: any[];
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
const placeholderImage = props.placeholderImage || import.meta.env.VITE_APP_SERVER_IP + '/assets/via-default-01.jpg';
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
    console.log(item);
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
  max-height: 550px; /* Aumenta a altura total do modal */
  background-color: $background;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.q-list {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.search-input {
  margin-bottom: 24px; /* Aumenta a distância entre o input e os itens */
}

.item-card {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  height: 80px; /* Define uma altura maior */
  margin: 4px 0; /* Remover margens laterais */
  padding: 0 12px; /* Padding lateral reduzido */
  width: 100%; /* Ocupar largura total */
}

.q-item-section {
  flex-shrink: 0;
  margin-right: 16px;
}

.q-avatar {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.item-label-primary {
  color: $primary;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.item-caption {
  color: $primary;
  font-size: 0.8rem;
}

.q-btn {
  margin: 0;
  padding: 0;
}

.q-dialog-plugin {
  min-width: 450px; /* Aumenta a largura do modal em 50px */
  max-height: 550px; /* Aumenta a altura do modal em 50px */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: $background;
  border-radius: 10px;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .q-pagination {
    flex-grow: 1;
    margin-left: 16px;
    font-size: 0.8rem; /* Fonte um pouco menor */
    color: white; /* Cor branca para os itens de paginação */
  }

  .items-per-page-select {
    width: 130px;
    border-radius: 5px;
  }

  .q-btn {
    color: $cumes-03;
    border: 1px solid $cumes-03;
    background-color: transparent;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
