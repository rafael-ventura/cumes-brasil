<template>
  <div v-if="fotos.length > 0" class="carrossel-fotos">
    <div class="carrossel-header">
      <q-icon name="photo_library" size="20px" class="header-icon" />
      <span class="header-titulo">Fotos da via</span>
      <span class="header-contagem">{{ fotos.length }}</span>
    </div>

    <q-carousel
      v-model="slideAtual"
      animated
      arrows
      navigation
      infinite
      class="carrossel"
      height="280px"
      control-color="white"
    >
      <q-carousel-slide
        v-for="(foto, index) in fotos"
        :key="foto.id"
        :name="index"
        class="carrossel-slide"
      >
        <q-img
          :src="obterUrl(foto.imagem.url)"
          :alt="`Foto ${index + 1} da via`"
          fit="cover"
          class="foto-img"
          :ratio="16/9"
        >
          <template #error>
            <div class="foto-erro">
              <q-icon name="broken_image" size="32px" />
            </div>
          </template>
        </q-img>

        <div v-if="foto.creditos || foto.usuario" class="foto-creditos">
          <q-icon name="photo_camera" size="14px" />
          <span>{{ foto.creditos || foto.usuario?.username || 'Anônimo' }}</span>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ImagemService from 'src/services/ImagemService';
import ViaImageSugestaoService from 'src/services/ViaImageSugestaoService';
import type { IViaImageSugestao } from 'src/models/IViaImageSugestao';

const props = defineProps<{ viaId: number }>();
defineExpose({ recarregar });

const fotos = ref<IViaImageSugestao[]>([]);
const slideAtual = ref(0);

onMounted(recarregar);

async function recarregar () {
  fotos.value = await ViaImageSugestaoService.listarAprovadaPorVia(props.viaId);
}

function obterUrl (url: string): string {
  return ImagemService.obterUrlCompleta(url);
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.carrossel-fotos {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba($cumes-01, 0.3);
}

.carrossel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba($cumes-01, 0.12);
  border-bottom: 1px solid rgba($cumes-01, 0.2);
}

.header-icon { color: $cumes-01; }
.header-titulo {
  font-size: 13px;
  font-weight: 700;
  color: $offwhite;
  flex: 1;
}
.header-contagem {
  font-size: 12px;
  color: rgba($offwhite, 0.6);
  background: rgba($offwhite, 0.1);
  padding: 2px 8px;
  border-radius: 99px;
}

.carrossel {
  background: $background;
}

.carrossel-slide {
  padding: 0;
  position: relative;
}

.foto-img {
  width: 100%;
  height: 100%;
}

.foto-erro {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba($offwhite, 0.4);
}

.foto-creditos {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.65));
  color: rgba(255,255,255,0.9);
  font-size: 12px;
}
</style>
