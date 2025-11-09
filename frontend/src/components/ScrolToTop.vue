<template>
  <q-btn
    v-if="showScrollToTop"
    class="scroll-to-top"
    icon="arrow_upward"
    color="primary"
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
  bottom: 170px; /* Posicionado acima do botão de adicionar (100px + 56px + 14px de espaço) */
  right: 5px; /* Posição original */
  z-index: 1001; /* Maior que o botão de adicionar para ficar acima */
  box-shadow: none; /* Visual original */
}
</style>
