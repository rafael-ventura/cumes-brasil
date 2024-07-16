<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-my-md">
      <div class="col-12 col-md">
        <q-input v-model="searchQuery" label="Buscar vias de escalada" @input="searchVias" debounce="300"/>
      </div>
      <div class="col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="openFilterModal"/>
      </div>
    </div>
    <ViaLista :vias="vias" @show-details="showViaDetails"/>
    <q-dialog v-model="isFilterModalOpen" persistent>
      <BuscaAvancada @apply-filters="applyFilters"/>
    </q-dialog>
    <ModalViaDetalhada :isOpen="isViaModalOpen" :via="<Via>selectedVia" @update:isOpen="isViaModalOpen = $event"/>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ViaService from "../services/ViaService";
import ViaLista from "components/Via/ViaLista.vue";
import BuscaAvancada from "components/Busca/BuscaAvancada.vue";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";
import { Via } from "src/models/Via";

const searchQuery = ref("");
const vias = ref<Via[]>([]);
const isFilterModalOpen = ref(false);
const isViaModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);
const appliedFilters = ref({});

defineOptions({
  name: "BuscaPage"
});

onMounted(async () => {
  await searchVias();
});

const searchVias = async () => {
  try {
    if (searchQuery.value.trim() === "" && Object.keys(appliedFilters.value).length === 0) {
      vias.value = await ViaService.getAllVias();
    } else {
      vias.value = await ViaService.searchVias(searchQuery.value, appliedFilters.value);
    }
  } catch (error) {
    console.error("Erro ao buscar vias:", error);
  }
};

const openFilterModal = () => {
  isFilterModalOpen.value = true;
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
