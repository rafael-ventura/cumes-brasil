<!-- pages/Busca.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Buscar Aventuras</div>
    <SearchInput label="Buscar vias de escalada" @update:query="onQueryUpdate"/>
    <ViaList :vias="vias"/>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ViaService from '../services/viaService'
import SearchInput from 'components/SearchInput.vue'
import ViaList from 'components/ViaList.vue'
import { Via } from 'components/models'

const searchQuery = ref('')
const vias = ref<Via[]>([])

const onQueryUpdate = async (query: string) => {
  searchQuery.value = query
  if (searchQuery.value.trim() === '') {
    vias.value = []
    return
  }
  try {
    vias.value = await ViaService.searchVias(searchQuery.value)
  } catch (error) {
    console.error('Erro ao buscar vias:', error)
  }
}
</script>
