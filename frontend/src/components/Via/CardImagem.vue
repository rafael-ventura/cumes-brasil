<template>
  <q-card class="q-ma-md bg-grey-3 rounded-borders">
    <q-img :src="src" alt="Imagem da via" class="via-img">
    </q-img>
  </q-card>
</template>

<script setup lang="ts">
defineProps({
  src: String
});
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}

</style>
