<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="modal-header">
      <div class="modal-title">
        <q-icon name="favorite" size="28px" class="title-icon" />
        <span>Escolher Via Preferida</span>
      </div>
    </q-card-section>

    <q-card-section class="modal-body">
      <q-input 
        v-model="searchQuery" 
        placeholder="Buscar vias..." 
        @input="searchVias" 
        debounce="300"
        outlined
        dense
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-list class="vias-list">
        <q-item 
          v-for="via in vias" 
          :key="via.id" 
          clickable 
          @click="addVia(via)"
          class="via-item"
          :class="{ 'via-selected': via.selected }"
        >
          <q-item-section avatar>
            <q-avatar square size="60px" class="custom-avatar">
              <q-img :src="via.imagem?.url || 'https://via.placeholder.com/60'" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="via-nome">{{ via.nome }}</q-item-label>
            <q-item-label caption class="via-montanha">
              <q-icon name="terrain" size="14px" />
              {{ via.montanha.nome }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              :icon="via.selected ? 'check_circle' : 'add_circle'"
              :class="via.selected ? 'btn-selected' : 'btn-add'"
              @click.stop="selectedVia(via)"
              :disabled="via.selected"
              size="md"
            />
          </q-item-section>
        </q-item>
        <q-item v-if="!vias.length" class="empty-state">
          <q-item-section class="text-center">
            <q-icon name="search_off" size="48px" color="grey-6" />
            <q-item-label class="empty-text">Nenhuma via encontrada</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="center" class="modal-actions">
      <q-btn 
        v-if="currentPage < totalPages" 
        @click="loadMoreVias" 
        label="Carregar mais vias"
        icon="expand_more"
        class="btn-load-more"
        outline
        no-caps
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Via } from 'src/models/Via';
import ViaService from 'src/services/ViaService';

interface ViaWithSelected extends Via {
  selected?: boolean;
}

const props = defineProps<{ viaPreferidaId: string }>();
const emit = defineEmits(['viaPreferidaUpdate']);

const searchQuery = ref('');
const vias = ref<ViaWithSelected[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const novaPreferencia = ref('');

const resetPagination = () => {
  currentPage.value = 1;
  vias.value = [];
};

const selectedVia = (via: ViaWithSelected) => {
  via.selected = true;
  emit('viaPreferidaUpdate', via);
};

const searchVias = async () => {
  resetPagination();
  if (searchQuery.value.trim()) {
    const result = await ViaService.getAllVias(1, 10);
    vias.value = result.vias.filter(via =>
      via.nome.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    );
  } else {
    await loadVias();
  }
};

const loadVias = async () => {
  const result = await ViaService.getAllVias(currentPage.value, 10);
  vias.value = currentPage.value === 1 ? result.vias : [...vias.value, ...result.vias];
  totalPages.value = Math.ceil(result.total / 10);
};

const loadMoreVias = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadVias();
  }
};

const addVia = (via: ViaWithSelected) => {
  emit('viaPreferidaUpdate', via);
  via.selected = true;
};

watch(() => props.viaPreferidaId,
  (newValue) => {
    if (newValue) {
      novaPreferencia.value = newValue;
    }
  },
  { immediate: true }
);

loadVias();
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-dialog-plugin {
  min-height: 500px;
  max-height: 80vh;
  width: 90vw;
  max-width: 600px;
  background-color: $background;
  border-radius: 16px;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    width: 700px;
    max-width: 700px;
  }

  @media (min-width: 1024px) {
    width: 800px;
    max-width: 800px;
    min-height: 600px;
  }
}

// Header
.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

// Body
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// Search Input
.search-input {
  margin-bottom: 8px;
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 12px;
    min-height: 48px;
    
    &::before {
      border-color: $cumes-01;
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 15px;
    font-weight: 500;
  }

  :deep(.q-icon) {
    color: $cumes-03;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    .q-field__control {
      background-color: $offwhite;
      
      &::before {
        border-color: $cumes-03;
        border-width: 2px;
      }
    }
  }
}

// Vias List
.vias-list {
  background-color: transparent;
  border-radius: 12px;
  overflow-y: auto;
  max-height: 450px;
}

.via-item {
  background-color: rgba($cumes-01, 0.05);
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba($cumes-01, 0.12);
    border-color: $cumes-01;
    transform: translateX(4px);
  }

  &.via-selected {
    background-color: rgba($cumes-04, 0.15);
    border-color: $cumes-04;
  }
}

.custom-avatar {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid $cumes-03;
  
  img {
    object-fit: cover;
  }
}

.via-nome {
  font-size: 16px;
  font-weight: 700;
  color: $offwhite;
  margin-bottom: 4px;
}

.via-montanha {
  font-size: 14px;
  color: $cumes-03;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-add {
  color: $cumes-03;
  transition: all 0.3s ease;

  &:hover {
    color: $cumes-01;
    transform: scale(1.1);
  }
}

.btn-selected {
  color: $cumes-04;
}

// Empty State
.empty-state {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  
  .empty-text {
    margin-top: 16px;
    font-size: 16px;
    color: $cumes-03;
    opacity: 0.7;
  }
}

// Modal Actions
.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid rgba($cumes-03, 0.2);
  background-color: rgba($cumes-01, 0.03);
}

.btn-load-more {
  color: $cumes-01;
  border-color: $cumes-01;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background-color: rgba($cumes-01, 0.1);
    border-color: $cumes-03;
    color: $cumes-03;
  }
}
</style>
