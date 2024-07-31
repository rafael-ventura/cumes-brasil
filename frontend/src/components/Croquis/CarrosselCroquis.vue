<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      control-color="amber"
      padding
      height="350px"
      class="bg-grey-9 shadow-2 rounded-borders"
    >
      <q-carousel-slide
        v-for="(croqui, index) in computedCroquis"
        :key="index"
        :name="index"
        :img-src="croqui.imagem.url"
        @click="openDialog(croqui.imagem.url)"
      />
    </q-carousel>
    <q-dialog v-model="dialog">
      <img :src="selectedImage" contain style="min-width: 40vh" zoom />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Croqui } from 'src/models/Croqui';

const props = defineProps<{ croquis?: Croqui[] }>();

const slide = ref(0);
const dialog = ref(false);
const selectedImage = ref('');

const defaultCroqui: { imagem: { url: string } } = {
  imagem: { url: 'https://mlabs-wordpress-site.s3.amazonaws.com/wp-content/uploads/2020/12/google-ads.png' }
};

// Computed property to provide a default croqui if croquis is empty or undefined
const computedCroquis = computed(() => (props.croquis && props.croquis.length > 0) ? props.croquis : [defaultCroqui]);

function openDialog (imageUrl: string) {
  selectedImage.value = imageUrl;
  dialog.value = true;
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
}
</style>
