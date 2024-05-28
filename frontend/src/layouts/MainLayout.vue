<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" elevated>
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-h4">Cumes Brasil</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <NavBar/>
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from "layouts/NavBar.vue";
</script>

<style scoped>

</style>
