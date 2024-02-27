<template>
  <v-app>
    <AppBar/>
    <v-main>
      <v-container fill-width>
        <router-view/>
      </v-container>
    </v-main>

    <nav-bar/>
  </v-app>
</template>
<script setup>
import AppBar from "@/components/AppBar.vue";
import NavBar from "@/components/NavBar.vue";
</script>
