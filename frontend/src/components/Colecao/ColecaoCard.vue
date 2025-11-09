<template>
  <q-card class="colecao-card" @click="emitClick" v-if="colecao && colecao.id">
    <q-card-section class="colecao-content">
      <div class="colecao-image">
        <!-- Exibe o `q-img` se `colecao.imagem?.url` estiver disponível -->
        <q-img
          v-if="colecao.imagem?.url"
          :src="colecao.imagem?.url"
          alt="Imagem da Coleção"
        />
        <!-- Caso contrário, exibe o componente `CroquiPlaceholderSvg` -->
        <ImagePlaceholder v-else :fillColor="'$primary'" />
      </div>
      <div class="colecao-info">
        <div class="colecao-header">
          <div class="text-h6">{{ colecao.nome }}</div>
          <div class="text-subtitle1" v-if="colecao.descricao">{{ colecao.descricao }}</div>
        </div>

        <!-- Badge de contagem de vias -->
        <div class="badge-container">
          <q-badge
            v-if="viasCarregadas !== null"
            class="badge-custom"
          >
            <span class="badge-label">Vias na coleção:</span>
            <span class="badge-value">{{ viasCarregadas }}</span>
          </q-badge>
          <q-badge v-else class="badge-custom badge-loading">
            <span class="badge-label">Carregando...</span>
          </q-badge>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';

const router = useRouter();
const props = defineProps<{ colecao: IColecao }>();
const emits = defineEmits(['click']);
const viasCarregadas = ref<number | null>(null); // Começa como null para mostrar "Carregando"

const verificarVias = () => {
  if (props.colecao.viaColecoes) {
    viasCarregadas.value = props.colecao.viaColecoes.length;
  } else {
    setTimeout(() => {
      verificarVias();
    }, 3000);
  }
};

watch(
  () => props.colecao.viaColecoes?.via,
  (vias) => {
    viasCarregadas.value = vias ? vias.length : null;
  },
  { immediate: true }
);

const emitClick = () => {
  emits('click');
  router.push(`/colecoes/${props.colecao.id}`);
};

onMounted(() => {
  verificarVias();
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.colecao-card {
  width: 100%;
  height: 100%;
  min-height: 150px; /* Reduzido de 180px */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px $box-shadow-medium;
  border-radius: 16px;
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 5%) 100%);
  border: 2px solid rgba($cumes-01, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px $box-shadow-strong;
    border-color: rgba($cumes-01, 0.6);
  }

  @media (max-width: 768px) {
    min-height: 130px; /* Reduzido de 160px */
  }
}

.colecao-content {
  display: flex;
  align-items: flex-start;
  padding: 16px; /* Reduzido de 20px */
  gap: 16px; /* Reduzido de 20px */
  flex: 1;
  height: 100%;
  position: relative;

  @media (max-width: 768px) {
    padding: 12px; /* Reduzido de 16px */
    gap: 12px; /* Reduzido de 16px */
  }
}

.colecao-image {
  width: 120px; /* Reduzido de 140px */
  min-width: 120px;
  height: 120px; /* Reduzido de 140px */
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($offwhite, 0.2);
  box-shadow: 0 4px 12px $box-shadow-medium;
  transition: all 0.3s ease;
  flex-shrink: 0;

  .q-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :deep(.svg-placeholder) {
    width: 80%;
    height: 80%;
    opacity: 0.6;
  }

  .colecao-card:hover & {
    transform: scale(1.03);
    box-shadow: 0 6px 16px $box-shadow-strong;
  }

  @media (max-width: 768px) {
    width: 85px; /* Reduzido de 100px */
    min-width: 85px;
    height: 85px; /* Reduzido de 100px */
  }
}

.colecao-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: $background;
  flex-grow: 1;
  min-width: 0;
  gap: 12px;
  height: 120px; /* Reduzido de 140px */
  position: relative;

  @media (max-width: 768px) {
    height: 85px; /* Reduzido de 100px */
  }
}

.colecao-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.text-h6 {
  margin: 0;
  color: $background;
  font-size: 20px;
  font-weight: 800;
  text-shadow: 0 2px 4px $text-shadow-default;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
  }
}

.text-subtitle1 {
  font-size: 13px;
  margin: 0;
  color: rgba($background, 0.8);
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge-container {
  display: flex;
  align-items: center;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.badge-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: $background;
  background: rgba($offwhite, 0.4);
  border: 2px solid rgba($background, 0.4);
  font-size: 14px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px $box-shadow-light;
  transition: all 0.2s ease;
  white-space: nowrap;

  &.badge-loading {
    opacity: 0.7;
  }

  .colecao-card:hover & {
    background: rgba($offwhite, 0.5);
    border-color: rgba($background, 0.5);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 16px;
  }
}

.badge-label {
  font-weight: 600;
  color: $background;
}

.badge-value {
  font-weight: 800;
  font-size: 16px;
  color: $cumes-03;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin-left: 6px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
}
</style>
