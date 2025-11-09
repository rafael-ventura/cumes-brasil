<template>
  <q-footer elevated class="text-black">
    <q-toolbar class="q-pa-md justify-around">
      <!-- Home -->
      <q-btn
        flat
        round
        size="md"
        icon="home"
        @click="goTo('/')"
        :class="{ 'selected-tab': isSelected('/') }"
      />

      <!-- Search -->
      <q-btn
        flat
        round
        size="md"
        icon="search"
        @click="goTo('/busca')"
        :class="{ 'selected-tab': isSelected('/busca') }"
      />

      <!-- Collections -->
      <q-btn
        flat
        round
        size="md"
        icon="style"
        @click="goTo('/colecoes')"
        :class="{ 'selected-tab': isSelected('/colecoes') }"
      />

      <!-- Profile -->
      <q-btn
        flat
        round
        size="md"
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
ref(Dark.isActive);
const goTo = (path: string) => {
  router.push(path);
};
const isSelected = (path: string) => {
  return route.path === path;
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
