<template>
  <v-bottom-navigation bg-color="secondary" v-model="value" grow>
    <v-btn router to="/">
      <v-icon>mdi-home-account</v-icon>
      Home
    </v-btn>

    <v-btn router to="/vias">
      <v-icon>mdi-carabiner</v-icon>
      Vias
    </v-btn>

    <v-btn router to="/colecoes">
      <v-icon>mdi-bookmark-multiple</v-icon>
      Colecoes
    </v-btn>

    <v-btn router to="/perfil">
      <v-icon>mdi-account</v-icon>
      Perfil
    </v-btn>
    <v-btn v-if="isAuthenticated" @click="logout">Sair</v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import authenticateService from "@/services/authenticateService";
import { useRouter } from "vue-router";

const value = 0;
const router = useRouter();
const isAuthenticated = ref(authenticateService.isAuthenticated());

watchEffect(() => {
  isAuthenticated.value = authenticateService.isAuthenticated();
});

function logout () {
  authenticateService.logout();
  isAuthenticated.value = false;
  router.push("/login"); // Redireciona para a página de login após logout
}
</script>
