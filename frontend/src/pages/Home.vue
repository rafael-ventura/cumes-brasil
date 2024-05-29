<template>
  <q-page class="q-pa-md">
    <div class="text-h1 q-mb-md">Welcome to the Adventure App</div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: "HomePage"
});
</script>

<style scoped>
/* Estilo específico para melhorar a aparência em dispositivos móveis */
.q-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
