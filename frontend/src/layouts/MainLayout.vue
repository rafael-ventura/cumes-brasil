<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="no-padding">
      <router-view/>
    </q-page-container>
    <NavBar/>
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from "layouts/NavBar.vue";
</script>

<style scoped>
/* Ajuste global para melhorar a aparência em dispositivos móveis */
.q-page-container {
  padding-top: 56px; /* Espaço para a navbar */
}

.q-layout__footer {
  height: 56px; /* Ajuste de altura para a footer */
}

.q-layout--view {
  min-height: 100vh; /* Certifique-se de que o layout ocupa toda a altura da tela */
}
</style>
