<template>
  <q-card class="q-ma-md bg-grey-3 rounded-borders card">
    <q-item class="q-ma-md">
      <q-img :src="src" alt="Imagem da via" class="via-img" @click="expandImage(src || 'https://via.placeholder.com/150')"/>
    </q-item>
  </q-card>
  <q-dialog v-model="isImageModalOpen">
    <q-card>
      <q-card-section class="q-pa-none">
        <img :src="expandedImageUrl" alt="Imagem expandida" class="full-width full-height" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  src: String
});

const isImageModalOpen = ref(false);
const expandedImageUrl = ref('');
const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}

</style>
