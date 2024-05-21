<template>
  <q-list bordered separator>
    <q-item v-for="via in props.vias" :key="via.id" clickable @click="goViaDetalhadaView(via)">
      <q-item-section>
        <q-item-label class="text-h6">{{ via.nome }}</q-item-label>
        <q-item-label caption>{{ via.montanha.nome }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-badge color="primary" label="Grau: {{ via.grau }}" />
        <q-badge color="secondary" label="Crux: {{ via.crux }}" class="q-ml-sm" />
        <q-badge color="info" label="Extensão: {{ via.extensao }}m" class="q-ml-sm" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Via } from 'components/models'

const props = defineProps<{ vias: Via[] }>()

const router = useRouter()

const goViaDetalhadaView = (via: Via) => {
  router.push(`/vias/${via.id}`)
}
</script>
