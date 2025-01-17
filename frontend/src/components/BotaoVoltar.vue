<template>
  <q-btn round  icon="arrow_back"  size="1.1rem" class="btn-back" @click="goBack"/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.q-btn.btn-back {
  background-color: $cumes-03;
  color: black;
  opacity: 0.8;
  z-index: 2;
}

</style>
