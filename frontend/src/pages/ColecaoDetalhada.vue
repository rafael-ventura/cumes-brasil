<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Expanded Collection</div>
    <!-- Add expanded collection functionality here -->
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import AuthenticateService from '../services/authenticateService'

const router = useRouter()

onMounted(() => {
  if (!AuthenticateService.isAuthenticated()) {
    router.push('/login')
  }
})

defineOptions({
  name: 'ColecaoDetalhadaPage'
})

</script>
