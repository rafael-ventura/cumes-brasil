<template>
  <q-expansion-item expand-separator icon="photo_camera" label="Croquis">
    <div class="carousel">
      <!-- Condicional para exibir imagem ou placeholder -->
      <template v-if="currentImage.url">
        <div class="carousel-wrapper">
          <img
            :src="currentImage.url"
            :alt="currentImage.nome"
            class="carousel-image"
          />
          <!-- Botões de navegação -->
          <button
            @click="prevImage"
            class="nav-button left"
            :disabled="isFirstImage"
          >
            ◀
          </button>
          <button
            @click="nextImage"
            class="nav-button right"
            :disabled="isLastImage"
          >
            ▶
          </button>
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
import { computed, onMounted, ref } from 'vue';
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
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }
};

const prevImage = () => {
  if (!isFirstImage.value) {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
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
  images.value = props.croquis.map((croqui) => ({
    url: croqui.imagem.url,
    nome: croqui.nome
  }));
  console.log(images.value);
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
  background-color: $cumes-03;
  border-radius: 8px;
}

.svg-placeholder {
  width: 80%;
  margin-bottom: -15%;
  margin-top: -20%;
  height: auto;
}

.nav-button {
  position: absolute;
  background: $cumes-01;
  color: black;
  border: none;
  font-size: 20px;
  width: 40px; /* Definindo largura fixa */
  height: 40px; /* Definindo altura fixa para manter circular */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%; /* Deixa o botão completamente redondo */
  opacity: 0.9;
  transition: opacity 0.3s ease, background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-button:hover {
  opacity: 1;
  background: darken($cumes-01, 10%);
  transform: scale(1.1); /* Efeito sutil de crescimento no hover */
}

.nav-button:disabled {
  background: rgba(0, 0, 0, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
}

.nav-button.left {
  left: 16px;
}

.nav-button.right {
  right: 16px;
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
