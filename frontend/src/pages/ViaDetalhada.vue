<!-- pages/ViaDetalhada.vue -->
<template>
  <div v-if="via">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ via.nome }}</div>
        <div class="text-subtitle2">{{ via.montanha.nome }}</div>
      </q-card-section>
      <q-card-section>
        <p><strong>Grau:</strong> {{ via.grau }}</p>
        <p><strong>Crux:</strong> {{ via.crux }}</p>
        <p><strong>Artificial:</strong> {{ via.artificial }}</p>
        <p><strong>Duração:</strong> {{ via.duracao }}</p>
        <p><strong>Exposição:</strong> {{ via.exposicao }}</p>
        <p><strong>Extensão:</strong> {{ via.extensao }}</p>
        <p><strong>Conquistadores:</strong> {{ via.conquistadores }}</p>
        <p><strong>Detalhes:</strong> {{ via.detalhes }}</p>
        <p><strong>Data:</strong> {{ via.data }}</p>
        <p><strong>Montanha:</strong> {{ via.montanha.nome }}</p>
        <p><strong>Face:</strong> {{ via.face.nome }}</p>
        <p><strong>Fonte:</strong> {{ via.fonte.autor }}</p>
      </q-card-section>
    </q-card>
  </div>
  <div v-else>
    <q-spinner nome="dots" size="2em" class="q-ma-md"/>
    <p>Carregando...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ViaService from '../services/viaService'
import { Via } from 'components/models'

const route = useRoute()
const via = ref<Via | null>(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    via.value = await ViaService.getViaById(id)
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error)
  }
})
</script>
