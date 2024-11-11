<template>
  <q-expansion-item expand-separator icon="photo_camera" label="Croquis">
    <div class="carousel">
      <!-- Condicional para exibir a imagem ou o SVG padrão -->
      <template v-if="currentImage.url">
        <img :src="currentImage.url" :alt="currentImage.nome" class="carousel-image" />
      </template>
      <template v-else>
        <div class="no-photo">
          <svg
            fill="#000000"
            height="100%"
            width="100%"
            viewBox="0 0 455 455"
            xmlns="http://www.w3.org/2000/svg"
            class="svg-placeholder"
          >
            <g>
              <polygon points="266.498,191.677 305.833,220.011 334.904,199.072 266.503,125.164 198.102,199.072 227.168,220.01 " />
              <polygon points="355.435,221.256 305.833,256.983 266.499,228.65 231.121,254.136 301.181,329.836 455,329.836 455,328.836 " />
              <polygon points="0,329.836 260.305,329.836 130.153,189.205 " />
            </g>
          </svg>
        </div>
      </template>

      <!-- Botões de navegação -->
      <button @click="prevImage" class="nav-button left">◀</button>
      <button @click="nextImage" class="nav-button right">▶</button>

      <!-- Legenda da imagem -->
      <div class="caption">{{ currentImage.nome }}</div>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Croqui } from 'src/models/Croqui';

const props = defineProps<{
  croquis: Croqui[];
}>();

const images = ref<{ url: string; nome: string }[]>([]);
const currentIndex = ref(0);

const currentImage = computed(() => images.value[currentIndex.value] || { url: null, nome: 'Sem Foto' });

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};

onMounted(() => {
  images.value = props.croquis.map((croqui) => ({
    url: croqui.imagem.url,
    nome: croqui.nome
  }));
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-expansion-item {
  background-color: $primary;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.no-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $tertiary;
  border-radius: 8px;
}

.svg-placeholder {
  width: 100%;
  height: auto;
}

.nav-button {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  padding: 8px;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
}

.nav-button.left {
  left: 16px;
}

.nav-button.right {
  right: 16px;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  font-size: 20px;
  text-align: left;
}

svg {
  fill: $primary;
  padding: 16px;
}
</style>
