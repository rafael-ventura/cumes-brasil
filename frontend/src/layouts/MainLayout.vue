<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
    <ScrollToTop />
    <NavBar />
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from 'layouts/NavBar.vue';
import ScrollToTop from 'components/ScrolToTop.vue';
</script>

<style scoped>
.page-container {
  padding-bottom: 56px; /* Espaço para a navbar */
  min-height: calc(100vh - 56px); /* Certifique-se de que o container ocupa toda a altura da tela menos a altura da navbar */
  overflow: auto; /* Permite rolagem dentro do container */
}
</style>
