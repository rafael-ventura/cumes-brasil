<template>
  <div @scroll="onScroll" class="item-sugestao-container">
    <!-- Campo de busca unificada -->
    <div class="form-field">
      <label class="field-label">Buscar por nome, bairro ou localização</label>
      <q-input
        v-model="unifiedSearch"
        outlined
        debounce="300"
        class="custom-input search-input"
        dense
        @input="onInputChange"
      />
    </div>
    <q-list>
      <q-item v-for="item in filteredItems" :key="item.id" clickable class="item-card">
        <q-item-section avatar>
          <div class="item-avatar-container">
            <q-img 
              v-if="itemType === 'via' && item.imagem?.url" 
              :src="item.imagem.url" 
              class="item-image"
            />
            <ImagePlaceholder 
              v-else-if="itemType === 'colecao'"
              fillColor="#8CB369"
              class="item-placeholder"
            />
            <q-img 
              v-else-if="itemType === 'via'"
              :src="placeholderImage" 
              class="item-image"
            />
          </div>
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
import ImagePlaceholder from 'components/ImagePlaceholder.vue';

interface Item {
  id: number;
  nome: string;
  imagem?: { url: string };
  localizacao?: {
    estado?: { nome: string; sigla: string };
    cidade?: { nome: string };
    bairro?: { nome: string };
  };
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
        (item.localizacao?.estado?.nome?.toLowerCase().includes(query)) ||
        (item.localizacao?.cidade?.nome?.toLowerCase().includes(query)) ||
        (item.localizacao?.bairro?.nome?.toLowerCase().includes(query))
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
    if (item.localizacao) {
      const parts = [];
      if (item.localizacao.estado) parts.push(item.localizacao.estado.sigla);
      if (item.localizacao.cidade) parts.push(item.localizacao.cidade.nome);
      if (item.localizacao.bairro) parts.push(item.localizacao.bairro.nome);
      return parts.join(', ') || '';
    }
    return '';
  } else if (props.itemType === 'colecao') {
    const quantidade = item.viaColecoes?.length || 0;
    return quantidade > 0 ? `${quantidade} ${quantidade === 1 ? 'via' : 'vias'}` : '0 vias';
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
  max-height: 500px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0;
}

// Form Field
.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

// Custom Input Styling
.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 8px !important;
    padding: 0 !important;
    
    &::before {
      border-color: $cumes-01 !important;
      border-width: 2px !important;
    }
  }

  :deep(.q-field__native) {
    color: $background !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  :deep(input) {
    color: $background !important;
    padding: 8px 12px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5) !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

.q-list {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.item-card {
  display: flex;
  align-items: center;
  background-color: rgba($cumes-01, 0.1);
  border-radius: 8px;
  min-height: 60px;
  margin: 6px 0;
  padding: 6px 10px;
  width: calc(100% - 8px);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba($cumes-01, 0.15);
    transform: translateX(4px);
  }
}

.q-item-section {
  flex-shrink: 0;
  margin-right: 12px;
}

.item-avatar-container {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($cumes-01, 0.2);
  transition: all 0.3s ease;
  padding: 0;
  
  .item-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    transition: transform 0.3s ease;
    padding: 0;
  }
  
  .item-placeholder {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    :deep(.svg-placeholder) {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
  }
  
  &:hover {
    transform: scale(1.05);
    background-color: rgba($cumes-01, 0.3);
    
    .item-image {
      transform: scale(1.08);
    }
  }
}

.item-label-primary {
  color: $offwhite;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 4px;
}

.item-caption {
  color: rgba($offwhite, 0.7);
  font-size: 13px;
}

.q-btn {
  margin: 0;
  padding: 0;
  min-width: 36px;
  height: 36px;
  
  :deep(.q-icon) {
    font-size: 20px;
  }
  
  &.q-btn--flat {
    color: $cumes-01 !important;
    
    &:hover {
      background-color: rgba($cumes-01, 0.2) !important;
    }
    
    &[disabled] {
      color: rgba($cumes-01, 0.5) !important;
    }
  }
}

.loading-item,
.no-results {
  padding: 16px;
  text-align: center;
  color: $cumes-03;
  font-weight: 600;
}
</style>
