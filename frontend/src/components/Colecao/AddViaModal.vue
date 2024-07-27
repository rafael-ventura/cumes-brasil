<template>
  <q-dialog v-model="dialogOpen" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Adicionar Via</div>
        <q-input v-model="searchQuery" label="Buscar vias" @input="searchVias" debounce="300" />
      </q-card-section>
      <q-card-section>
        <via-sugestao :vias="suggestedVias" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="closeDialog" />
      </q-card-actions>
    </q-card>
    <q-pagination v-if="totalPages > 1" v-model="currentPage" :max="totalPages" @update:model-value="onPageChange" />
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
    loadVias();
  }
});

const searchVias = async () => {
  if (searchQuery.value.trim()) {
    const result = await ColecaoService.getViasNotIn(props.colecaoId, currentPage.value);
    suggestedVias.value = result.vias
      .filter(via => via.nome.toLowerCase().includes(searchQuery.value.trim().toLowerCase()))
      .map((via: ViaWithAdded) => ({ ...via, added: false }));
    totalPages.value = Math.ceil(result.total / 10);
  } else {
    await loadVias();
  }
};

const loadVias = async () => {
  const result = await ColecaoService.getViasNotIn(props.colecaoId, currentPage.value);
  suggestedVias.value = result.vias.map((via: ViaWithAdded) => ({ ...via, added: false }));
  totalPages.value = Math.ceil(result.total / 10);
};

const addVia = (via: ViaWithAdded) => {
  emit('via-added', via);
  via.added = true;
};

const closeDialog = () => {
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
</style>
