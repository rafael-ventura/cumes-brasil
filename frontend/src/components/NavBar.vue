<template>
  <v-bottom-navigation v-model="value" >
    <router-link to="/" value="home" exact>
      <button>
        <v-icon>mdi-home-account</v-icon>
        Home
      </button>
    </router-link>

    <router-link to="/vias" value="home" exact>
      <button>
        <v-icon>mdi-carabiner</v-icon>
        Vias
      </button>
    </router-link>

    <router-link to="/colecoes" value="home" exact>
      <button>
        <v-icon>mdi-bookmark-multiple</v-icon>
        Colecoes
      </button>
    </router-link>

    <router-link to="/perfil" value="home" exact>
      <button>
        <v-icon>mdi-account</v-icon>
        Perfil
      </button>
    </router-link>

    <router-link v-show="isAuthenticated" @click="logout" to="/login" value="home" exact>
      <button>
        Sair
      </button>
    </router-link>
  </v-bottom-navigation>
</template>

<script setup>
import { watchEffect } from 'vue';
import authenticateService from "@/services/authenticateService";
import { useRouter } from "vue-router";

const value = 0;
const router = useRouter();
const isAuthenticated = authenticateService.isAuthenticated;

watchEffect(() => {
  isAuthenticated.value = authenticateService.isAuthenticated.value;
});

authenticateService.watchAuthStateChange((newAuthState) => {
  isAuthenticated.value = newAuthState;
});

function logout () {
  authenticateService.logout();
  router.push("/login");
}
</script>
<style lang="scss">
@import "@/assets/styles";
body .v-bottom-navigation {
  background-color: map-get($colors, 'secondary');
  button {
    height: 100%;
    text-decoration: none;
    color: map-get($colors, 'text-light');
    background-color: map-get($colors, 'secondary');
    &:hover {
      background-color: color(septenary);
    }
  }
  .router-link-exact-active button {
    background-color: color(octonary); // Altere para a cor desejada quando o botão estiver ativo
  }
}
</style>
