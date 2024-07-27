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
        :name="-1"
        img-src="https://mlabs-wordpress-site.s3.amazonaws.com/wp-content/uploads/2020/12/google-ads.png"
        @click="openDialog('https://mlabs-wordpress-site.s3.amazonaws.com/wp-content/uploads/2020/12/google-ads.png')"
      />
      <q-carousel-slide
        v-for="(croqui, index) in croquis"
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
import { ref } from 'vue';
import { Croqui } from 'src/models/Croqui';

const props = defineProps({
  croquis: Array as () => Croqui[]
});
const slide = ref(-1);
const dialog = ref(false);
const selectedImage = ref('');

function openDialog (imageUrl: string) {
  selectedImage.value = imageUrl;
  dialog.value = true;
}
</script>
