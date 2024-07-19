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
    <ViaLista :vias="vias" />
    <q-dialog v-model="isFilterModalOpen" persistent>
      <BuscaAvancada @apply-filters="applyFilters"/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ViaService from "../services/ViaService";
import ViaLista from "components/Via/ViaLista.vue";
import BuscaAvancada from "components/Busca/BuscaAvancada.vue";
import { Via } from "src/models/Via";
import {useRouter} from "vue-router";

const searchQuery = ref("");
const vias = ref<Via[]>([]);
const isFilterModalOpen = ref(false);
const appliedFilters = ref({});
const router = useRouter();

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
      vias.value = await ViaService.search(searchQuery.value);
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
</script>
