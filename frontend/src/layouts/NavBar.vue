<template>
  <q-footer elevated class="text-black">
    <q-toolbar class="q-pa-md justify-around">
      <!-- Início -->
      <q-btn
        flat
        round
        size="md"
        icon="home"
        @click="irPara('/')"
        :class="{ 'selected-tab': estaSelecionado('/') }"
      />

      <!-- Explorar -->
      <q-btn
        flat
        round
        size="md"
        icon="search"
        @click="irPara('/explorar')"
        :class="{ 'selected-tab': estaSelecionado('/explorar') || estaSelecionado('/busca') }"
      />

      <!-- Coleções -->
      <q-btn
        flat
        round
        size="md"
        icon="style"
        @click="irPara('/colecoes')"
        :class="{ 'selected-tab': estaSelecionado('/colecoes') }"
      />

      <!-- Admin (só para admins) -->
      <q-btn
        v-if="eAdmin"
        flat
        round
        size="md"
        icon="admin_panel_settings"
        @click="irPara('/admin')"
        :class="{ 'selected-tab': estaSelecionado('/admin') }"
        style="color: #BC4B51"
      />

      <!-- Perfil -->
      <q-btn
        flat
        round
        size="md"
        icon="account_circle"
        @click="irParaPerfil"
        :class="{ 'selected-tab': estaSelecionado('/perfil') }"
      />

      <!-- Dark mode toggle -->
      <!--  <q-btn
        flat
        round
        size="lg"
        :icon="isDarkMode ? 'brightness_7' : 'brightness_4'"
        @click="toggleDarkMode"
      />
      -->
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';

const router = useRouter();
const route = useRoute();
const eAdmin = ref(AuthenticateService.isAdmin());

onMounted(async () => {
  if (AuthenticateService.isTokenValid()) {
    await AuthenticateService.sincronizarPrivilegiosSessao();
    eAdmin.value = AuthenticateService.isAdmin();
  }
});

const irPara = (caminho: string) => {
  router.push(caminho);
};

const irParaPerfil = () => {
  const username = AuthenticateService.getUsername();
  router.push(username ? `/perfil/${username}` : '/perfil/me');
};

const estaSelecionado = (caminho: string) => {
  if (caminho === '/perfil') return route.path.startsWith('/perfil');
  return route.path === caminho;
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.q-footer .q-toolbar {
  height: 80px;
  justify-content: space-around;
  z-index: 10;
}

.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: $primary;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
}

.selected-tab {
  color: black
}

.q-btn:hover,
.q-btn:active {
  color: black;
}
</style>
