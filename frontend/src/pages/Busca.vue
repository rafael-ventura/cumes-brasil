<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-my-md">
      <div class="col-12 col-md">
        <q-input v-model="searchQuery" label="Buscar vias de escalada" @input="searchVias" debounce="300"/>
      </div>
      <div class="col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="isFilterModalOpen = true"/>
      </div>
    </div>
    <ViaLista :vias="vias" @show-details="showViaDetails"/>
    <BuscaAvancada @apply-filters="applyFilters" v-model="isFilterModalOpen"/>
    <q-dialog v-model="isViaModalOpen" persistent>
      <ModalViaDetalhada :via="<Via>selectedVia" is-open/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ViaService from '../services/ViaService';
import ViaLista from 'components/Via/ViaLista.vue';
import BuscaAvancada from 'components/Busca/BuscaAvancada.vue';
import ModalViaDetalhada from 'components/Via/ModalViaDetalhada.vue';
import { Via } from 'src/models/Via';

const isFilterModalOpen = ref(false);
const isViaModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);
const appliedFilters = ref({});
const searchQuery = ref('');
const vias = ref<Via[]>([]);
const totalPages = ref(1);
const currentPage = ref(1);

defineOptions({
  name: 'BuscaPage'
});

onMounted(async () => {
  await searchVias();
});

const searchVias = async () => {
  try {
    if (searchQuery.value.trim() === '') {
      const result = await ViaService.getAllVias(currentPage.value);
      vias.value = result.vias;
      totalPages.value = Math.ceil(result.total / 10);
    } else {
      const result = await ViaService.searchVias(searchQuery.value, { page: currentPage.value });
      vias.value = result.vias;
      totalPages.value = Math.ceil(result.total / 10);
    }
  } catch (error) {
    console.error('Erro ao buscar vias:', error);
  }
};

const applyFilters = async (filters: any) => {
  appliedFilters.value = filters;
  await searchVias();
  isFilterModalOpen.value = false;
};

const showViaDetails = (via: Via) => {
  selectedVia.value = via;
  isViaModalOpen.value = true;
};
</script>
