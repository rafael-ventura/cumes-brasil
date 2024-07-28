<template>
  <q-dialog v-model="dialogOpen" :persistent="false" @hide="handleHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Adicionar Via</div>
        <q-input v-model="searchQuery" label="Buscar vias" @input="searchVias" debounce="300" />
        <via-sugestao :vias="suggestedVias" @add-via="addVia" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn v-if="currentPage < totalPages" @click="loadMoreVias" label="Carregar mais" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ColecaoService from 'src/services/ColecaoService';
import { Via } from 'src/models/Via';
import ViaSugestao from 'components/Colecao/ViaSugestao.vue';

interface ViaWithAdded extends Via {
  added?: boolean;
}

const props = defineProps<{ isOpen: boolean; colecaoId: string }>();
const emit = defineEmits(['update:isOpen', 'via-added']);

const searchQuery = ref('');
const suggestedVias = ref<ViaWithAdded[]>([]);
const dialogOpen = ref(props.isOpen);
const currentPage = ref(1);
const totalPages = ref(1);

watch(() => props.isOpen, (newValue) => {
  dialogOpen.value = newValue;
  if (newValue) {
    currentPage.value = 1; // Resetar a página ao abrir o modal
    loadVias(); // Carregar vias ao abrir o modal
  }
});

watch(dialogOpen, (newValue) => {
  if (newValue) {
    currentPage.value = 1; // Resetar a página ao abrir o modal
    loadVias(); // Carregar vias ao abrir o modal
  } else {
    emit('update:isOpen', false);
  }
});

const searchVias = async () => {
  if (searchQuery.value.trim()) {
    const result = await ColecaoService.getViasNotIn(props.colecaoId, currentPage.value, 10);
    suggestedVias.value = result.vias
      .filter(via => via.nome.toLowerCase().includes(searchQuery.value.trim().toLowerCase()))
      .map((via: ViaWithAdded) => ({ ...via, added: false }));
    totalPages.value = Math.ceil(result.total / 10);
  } else {
    await loadVias();
  }
};

const loadVias = async () => {
  const result = await ColecaoService.getViasNotIn(props.colecaoId, currentPage.value, 10);
  if (currentPage.value === 1) {
    suggestedVias.value = result.vias.map((via: ViaWithAdded) => ({ ...via, added: false }));
  } else {
    suggestedVias.value.push(...result.vias.map((via: ViaWithAdded) => ({ ...via, added: false })));
  }
  totalPages.value = Math.ceil(result.total / 10);
};

const loadMoreVias = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    await loadVias();
  }
};

const addVia = (via: ViaWithAdded) => {
  emit('via-added', via);
  via.added = true;
};

const closeDialog = () => {
  dialogOpen.value = false; // Atualiza o estado do diálogo
};

const handleHide = () => {
  dialogOpen.value = false;
  emit('update:isOpen', false);
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  searchVias();
};
</script>

<style scoped>
.custom-avatar {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.q-dialog-plugin {
  height: 60%;
}
</style>
