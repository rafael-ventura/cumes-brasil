<template>
  <q-btn
    v-if="showScrollToTop"
    class="scroll-to-top"
    icon="arrow_upward"
    dense
    @click="scrollToTop"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const showScrollToTop = ref(false);

// Função para rolar para o topo
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Função para monitorar o scroll
const handleScroll = () => {
  // Verifica se o scroll total da página é maior que a altura da janela
  showScrollToTop.value = showScrollToTop.value = window.scrollY > 400; // Mostra o botão se a página puder rolar
};

// Adicionar/remover listener de scroll
onMounted(() => {
  handleScroll(); // Chama imediatamente para verificar na montagem
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.scroll-to-top {
  position: fixed;
  bottom: 95px;
  right: 5px;
  z-index: 1000;
  box-shadow: none; /* Remove a sombra para combinar com o design */
}
</style>
