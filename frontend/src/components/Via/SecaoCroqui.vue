<template>
  <q-expansion-item expand-separator icon="photo_camera" label="Croquis">
    <div class="carousel">
      <template v-if="currentImage.url">
        <div class="carousel-wrapper">
          <q-img
            :src="currentImage.url"
            :alt="currentImage.nome"
            class="carousel-image"
            spinner-color="white"
          />
          <!-- Botões de navegação -->
          <q-btn
            flat
            round
            icon="arrow_back"
            class="nav-button left"
            :disable="isFirstImage"
            @click="prevImage"
          />
          <q-btn
            flat
            round
            icon="arrow_forward"
            class="nav-button right"
            :disable="isLastImage"
            @click="nextImage"
          />
        </div>
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

      <!-- Legenda e botão de download -->
      <div class="footer">
        <span class="caption">{{ currentImage.nome }}</span>
        <q-btn
          dense
          flat
          icon="download"
          ripple="false"
          label="Baixar"
          @click="downloadImage(currentImage)"
          class="download-button"
        />
      </div>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Croqui } from 'src/models/Croqui';
import { saveAs } from 'file-saver';

const props = defineProps<{
  croquis: Croqui[];
}>();

const images = ref<{ url: string; nome: string }[]>([]);
const currentIndex = ref(0);

const currentImage = computed(() => images.value[currentIndex.value] || { url: null, nome: 'Sem Croquis Disponíveis' });

const isFirstImage = computed(() => currentIndex.value === 0);
const isLastImage = computed(() => currentIndex.value === images.value.length - 1);

const nextImage = () => {
  if (!isLastImage.value) {
    currentIndex.value += 1;
  }
};

const prevImage = () => {
  if (!isFirstImage.value) {
    currentIndex.value -= 1;
  }
};

const downloadImage = async (image: { url: string; nome: string }) => {
  if (!image?.url) {
    console.error('URL inválida ou ausente.');
    return;
  }

  try {
    const response = await fetch(image.url);
    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      return;
    }

    const blob = await response.blob();
    saveAs(blob, image.nome || 'croqui');
  } catch (error) {
    console.error('Erro ao fazer o download da imagem:', error);
  }
};

onMounted(() => {
  images.value = props.croquis
    .filter((croqui) => croqui.imagem?.url)
    .map((croqui) => ({
      url: croqui.imagem!.url,
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.carousel-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
}

.no-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $cumes-03;
  border-radius: 8px;
}

.svg-placeholder {
  width: 80%;
  height: auto;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: $cumes-01;
  color: white;
  border: none;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  opacity: 0.9;
  transition: opacity 0.3s ease, background 0.3s ease;

  &:disabled {
    background: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.nav-button.left {
  left: 8px;
}

.nav-button.right {
  right: 8px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 8px 8px;
  color: $cumes-03;
}

.caption {
  font-size: 16px;
  font-weight: bold;
}

.download-button {
  background-color: $cumes-03;
  color: black;
  font-size: 12px;
  border-radius: 8px;
  padding: 4px 8px;
}
</style>
