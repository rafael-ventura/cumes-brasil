<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <NavBar/>
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from 'layouts/NavBar.vue'
</script>
