<template>
  <v-bottom-navigation v-model="value" grow>
    <v-btn router to="/" class="btn">
      <v-icon>mdi-home-account</v-icon>
      Home
    </v-btn>

    <v-btn router to="/vias" class="btn">
      <v-icon>mdi-carabiner</v-icon>
      Vias
    </v-btn>

    <v-btn router to="/colecoes" class="btn">
      <v-icon>mdi-bookmark-multiple</v-icon>
      Colecoes
    </v-btn>

    <v-btn router to="/perfil" class="btn">
      <v-icon>mdi-account</v-icon>
      Perfil
    </v-btn>
    <v-btn v-if="isAuthenticated" @click="logout" router to="/login" class="btn">
      Sair
    </v-btn>
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
<style lang="scss">
@import "@/assets/styles";
body .v-bottom-navigation {
  background-color: map-get($colors, 'secondary');
  .btn {
    text-decoration: none;
    color: map-get($colors, 'text-light');
    .v-btn__overlay {
      background-color: map-get($colors, 'tertiary');
      color: map-get($colors, 'text') !important;
    }
  }
  .v-btn {
    &:hover, &:focus {
      color: map-get($colors, 'quinary') !important;
    }
  }
  .v-btn:hover {
    color: map-get($colors, 'quinary') !important;
  }
}
</style>
