<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-my-md">
      <div class="col">
        <q-input
          v-model="searchQuery"
          label="Buscar vias de escalada"
          @input="searchVias"
          debounce="300"
        />
      </div>
      <div class="col-auto">
        <q-btn flat icon="filter_list" label="Filtros" @click="openFilterModal"/>
      </div>
    </div>
    <ViaLista :vias="vias"/>
    <q-dialog v-model="isFilterModalOpen" persistent>
      <FiltrosAvancados @apply-filters="applyFilters"/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ViaService from '../services/viaService'
import ViaLista from 'components/ViaLista.vue'
import { Via } from 'components/models'
import FiltrosAvancados from 'components/FiltrosAvancados.vue'

defineOptions({
  name: 'BuscaPage'
})

const searchQuery = ref('')
const vias = ref<Via[]>([])
const isFilterModalOpen = ref(false)

const searchVias = async () => {
  if (searchQuery.value.trim() === '') {
    vias.value = await ViaService.getAllVias()
  } else {
    try {
      vias.value = await ViaService.searchVias(searchQuery.value)
    } catch (error) {
      console.error('Erro ao buscar vias:', error)
    }
  }
}

const openFilterModal = () => {
  isFilterModalOpen.value = true
}

const applyFilters = async (filters: any) => {
  try {
    vias.value = await ViaService.searchViasWithFilters(filters)
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error)
  }
  isFilterModalOpen.value = false
}

onMounted(() => {
  searchVias()
})
</script>
