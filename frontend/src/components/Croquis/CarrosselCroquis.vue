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
      height="300px"
      class="bg-grey-9 shadow-2 rounded-borders"
    >
      <!-- Podemos chamar uma propaganda aqui. Um ads -->
      <q-carousel-slide :name="0" img-src="https://mlabs-wordpress-site.s3.amazonaws.com/wp-content/uploads/2020/12/google-ads.png" />
      <q-carousel-slide
        v-for="(croqui, index) in croquis"
        :key="index"
        :name="index"
        :img-src="croqui.imagem.url"
      />
    </q-carousel>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Croqui } from "src/models/Croqui";

const props = defineProps({
  croquis: Array as () => Croqui[]
});
const slide = ref(0);
</script>
