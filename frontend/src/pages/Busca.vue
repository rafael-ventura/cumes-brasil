<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-my-md">
      <div class="col-12 col-md">
        <q-input
          v-model="searchQuery"
          label="Buscar vias de escalada"
          @input="searchVias"
          debounce="300"
        />
      </div>
      <div class="col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="openFilterModal" />
      </div>
    </div>
    <ViaLista :vias="vias" @show-details="showViaDetails" />
    <q-dialog v-model="isFilterModalOpen" persistent>
      <FiltrosAvancados @apply-filters="applyFilters" />
    </q-dialog>
    <ModalViaDetalhada :isOpen="isViaModalOpen" :via="<Via>selectedVia" @update:isOpen="isViaModalOpen = $event" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ViaService from "../services/ViaService";
import ViaLista from "components/Via/ViaLista.vue";
import FiltrosAvancados from "components/Busca/FiltrosAvancados.vue";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";
import { Via } from "src/models/Via";

const searchQuery = ref("");
const vias = ref<Via[]>([]);
const isFilterModalOpen = ref(false);
const isViaModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);

defineOptions({
  name: "BuscaPage"
});

onMounted(() => {
  searchVias();
});

const searchVias = async () => {
  if (searchQuery.value.trim() === "") {
    vias.value = await ViaService.getAllVias();
  } else {
    try {
      vias.value = await ViaService.searchVias(searchQuery.value);
    } catch (error) {
      console.error("Erro ao buscar vias:", error);
    }
  }
};

const openFilterModal = () => {
  isFilterModalOpen.value = true;
};

const applyFilters = async (filters: any) => {
  try {
    vias.value = await ViaService.searchViasWithFilters(filters);
  } catch (error) {
    console.error("Erro ao aplicar filtros:", error);
  }
  isFilterModalOpen.value = false;
};

const showViaDetails = (via: Via) => {
  selectedVia.value = via;
  isViaModalOpen.value = true;
};

</script>
