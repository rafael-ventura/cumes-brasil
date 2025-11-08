<template>
  <q-layout view="lHh lpR fFf">
    <!-- TopBar (Desktop) - Visível apenas em telas grandes -->
    <TopBar v-if="isDesktop" />

    <q-page-container :class="pageContainerClass">
      <router-view />
    </q-page-container>

    <ScrollToTop />

    <!-- NavBar (Mobile) - Visível apenas em telas pequenas -->
    <NavBar v-if="!isDesktop" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavBar from 'layouts/NavBar.vue';
import TopBar from 'layouts/TopBar.vue';
import ScrollToTop from 'components/ScrolToTop.vue';

const windowWidth = ref(window.innerWidth);

// Detectar se é desktop (breakpoint: 1024px)
const isDesktop = computed(() => windowWidth.value >= 1024);

// Classe dinâmica para o page container
const pageContainerClass = computed(() => {
  if (isDesktop.value) {
    return 'page-container-desktop';
  }
  return 'page-container-mobile';
});

// Listener para resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

// Container para Mobile (com bottom navbar)
.page-container-mobile {
  padding-bottom: 56px;
}

// Container para Desktop (com topbar)
.page-container-desktop {
  padding-top: 70px;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
