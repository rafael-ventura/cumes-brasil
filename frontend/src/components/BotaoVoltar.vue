<template>
  <q-btn round icon="arrow_back"  size="1.1rem" class="btn-back" @click="goBack"/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
