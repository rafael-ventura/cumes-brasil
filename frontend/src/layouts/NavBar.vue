<template>
  <q-footer elevated class="text-black">
    <q-toolbar class="q-pa-md justify-around">
      <!-- Home -->
      <q-btn
        flat
        round
        size="lg"
        icon="home"
        @click="goTo('/')"
        :class="{ 'selected-tab': isSelected('/') }"
      />

      <!-- Search -->
      <q-btn
        flat
        round
        size="lg"
        icon="search"
        @click="goTo('/busca')"
        :class="{ 'selected-tab': isSelected('/busca') }"
      />

      <!-- Collections -->
      <q-btn
        flat
        round
        size="lg"
        icon="style"
        @click="goTo('/colecoes')"
        :class="{ 'selected-tab': isSelected('/colecoes') }"
      />

      <!-- Profile -->
      <q-btn
        flat
        round
        size="lg"
        icon="account_circle"
        @click="goTo('/perfil')"
        :class="{ 'selected-tab': isSelected('/perfil') }"
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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dark } from 'quasar';

const router = useRouter();
const route = useRoute();
const isDarkMode = ref(Dark.isActive);

const goTo = (path: string) => {
  router.push(path);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  Dark.set(isDarkMode.value);
};

const isSelected = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
.q-toolbar {
  justify-content: space-around;
  z-index: 1; /* Garante que a navbar esteja sempre acima do conteúdo */
}

.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fcbd7b;
}

.selected-tab {
  background-color: #bce9b4 !important; /* Cor mais clara quando o botão está selecionado */
  color: black !important; /* Garante que o ícone permaneça visível */
}

.q-btn:hover,
.q-btn:active {
  background-color: #96c589 !important; /* Cor mais escura para hover e botão pressionado */
}
</style>
