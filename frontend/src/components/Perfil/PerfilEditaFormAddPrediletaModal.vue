<template>
  <q-card class="q-dialog-plugin">
    <q-card-section>
      <div class="text-h6">Escolher Via Preferida</div>
      <q-input v-model="searchQuery" label="Buscar vias" @input="searchVias" debounce="300" />
      <q-list bordered separator>
        <q-item v-for="via in vias" :key="via.id" clickable @click="addVia(via)">
          <q-item-section avatar>
            <q-avatar square size="50px" class="custom-avatar">
              <q-img :src="via.imagem?.url || 'https://via.placeholder.com/50'" cover />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ via.nome }}</q-item-label>
            <q-item-label>{{ via.montanha.nome }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              :icon="via.selected ? 'check' : 'add'"
              :color="via.selected ? 'green' : 'primary'"
              @click.stop="selectedVia(via)"
              :disabled="via.selected" />
          </q-item-section>
        </q-item>
        <q-item v-if="!vias.length">
          <q-item-section>
            <q-item-label>Nenhuma via encontrada.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn v-if="currentPage < totalPages" @click="loadMoreVias" label="Carregar mais" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
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
  height: 60%;
  color: $cumes-01;
  background-color: $dark;
}
.custom-avatar img {
  object-fit: cover;
}
</style>
