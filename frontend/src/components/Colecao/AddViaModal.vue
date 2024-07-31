<template>
  <q-dialog v-model="dialogOpen" @hide="handleHide">
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
import { ref, watch, onMounted } from 'vue';
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

const resetPagination = () => {
  currentPage.value = 1;
  suggestedVias.value = [];
};

const loadVias = async () => {
  const result = await ColecaoService.getViasNotIn(props.colecaoId, currentPage.value, 10);
  suggestedVias.value = currentPage.value === 1 ? result.vias : [...suggestedVias.value, ...result.vias];
  totalPages.value = Math.ceil(result.total / 10);
};

const searchVias = async () => {
  resetPagination();
  if (searchQuery.value.trim()) {
    const result = await ColecaoService.getViasNotIn(props.colecaoId, 1, 10);
    suggestedVias.value = result.vias.filter(via =>
      via.nome.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    );
  } else {
    await loadVias();
  }
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

const handleHide = () => {
  dialogOpen.value = false;
  emit('update:isOpen', false);
};

watch(() => props.isOpen, (newValue) => {
  dialogOpen.value = newValue;
  if (newValue) {
    resetPagination();
    loadVias();
  }
});

watch(dialogOpen, (newValue) => {
  if (!newValue) {
    emit('update:isOpen', false);
  }
});

onMounted(() => {
  if (props.isOpen) {
    resetPagination();
    loadVias();
  }
});
</script>

<style scoped>
.q-dialog-plugin {
  height: 60%;
}
</style>
