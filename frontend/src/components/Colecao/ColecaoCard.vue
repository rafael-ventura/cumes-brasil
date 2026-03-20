<template>
  <q-card class="colecao-card" v-if="colecao && colecao.id" @click="irDetalhe">
    <q-card-section class="colecao-content">
      <div class="colecao-image">
        <q-img
          v-if="urlCapa"
          :src="urlCapa"
          alt="Capa da coleção"
        />
        <ImagePlaceholder v-else :fillColor="'$primary'" />
      </div>
      <div class="colecao-info">
        <div class="colecao-header">
          <div class="titulo-linha">
            <div class="text-h6">{{ colecao.nome }}</div>
            <div v-if="exibirMenu" class="menu-wrap" @click.stop>
              <q-btn
                round
                flat
                dense
                icon="more_vert"
                class="btn-menu-colecao"
                aria-label="Opções da coleção"
                @click.stop
              >
                <q-menu
                  anchor="bottom right"
                  self="top right"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                >
                  <q-list dense class="menu-colecao-lista">
                    <q-item v-close-popup clickable @click="emit('editar', colecao)">
                      <q-item-section avatar>
                        <q-icon name="edit" color="cumes-01" size="20px" />
                      </q-item-section>
                      <q-item-section>Editar coleção</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      :disable="ehFavoritos"
                      :title="ehFavoritos ? 'A coleção Favoritas não pode ser excluída' : undefined"
                      @click="emit('excluir', colecao)"
                    >
                      <q-item-section avatar>
                        <q-icon name="delete" :color="ehFavoritos ? 'grey-6' : 'negative'" size="20px" />
                      </q-item-section>
                      <q-item-section :class="{ 'text-grey-6': ehFavoritos }">
                        Excluir coleção
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <div class="text-subtitle1" v-if="colecao.descricao">{{ colecao.descricao }}</div>
        </div>

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
import { computed, onMounted, ref, watch } from 'vue';
import { IColecao } from 'src/models/IColecao';
import { useRouter } from 'vue-router';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';
import ImagemService from 'src/services/ImagemService';
import { ehColecaoFavoritos } from 'src/utils/colecaoUtils';

const props = withDefaults(
  defineProps<{ colecao: IColecao; exibirMenu?: boolean }>(),
  { exibirMenu: false }
);
const emit = defineEmits<{ editar: [IColecao]; excluir: [IColecao] }>();

const router = useRouter();
const viasCarregadas = ref<number | null>(null);

const ehFavoritos = computed(() => ehColecaoFavoritos(props.colecao));

const urlCapa = computed(() => {
  const url = props.colecao.imagemCapa?.url || props.colecao.imagem?.url;
  return url ? ImagemService.getFullImageUrl(url) : null;
});

function irDetalhe () {
  router.push(`/colecoes/${props.colecao.id}`);
}

const verificarVias = () => {
  const vc = props.colecao.viaColecoes;
  if (Array.isArray(vc)) {
    viasCarregadas.value = vc.length;
  } else if (vc != null) {
    viasCarregadas.value = 0;
  }
};

watch(
  () => props.colecao.viaColecoes,
  () => verificarVias(),
  { immediate: true, deep: true }
);

onMounted(() => {
  verificarVias();
});
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.colecao-card {
  width: 100%;
  height: 100%;
  min-height: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 12px $box-shadow-medium,
    0 1px 0 rgba($offwhite, 0.06) inset;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba($cumes-01, 0.95) 0%, darken($cumes-01, 6%) 100%);
  border: 1px solid rgba($offwhite, 0.12);
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 12px 28px $box-shadow-strong,
      0 1px 0 rgba($offwhite, 0.08) inset;
    border-color: rgba($cumes-03, 0.35);
  }

  @media (max-width: 768px) {
    min-height: 130px;
  }
}

.colecao-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 16px;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
}

.menu-wrap {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.btn-menu-colecao {
  color: $offwhite !important;
  opacity: 0.92;

  &:hover {
    background: rgba($offwhite, 0.12) !important;
    opacity: 1;
  }
}

.menu-colecao-lista {
  min-width: 200px;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px $box-shadow-dark !important;
  border: 1px solid rgba($cumes-01, 0.35);
  background: $background !important;

  :deep(.q-item) {
    color: $offwhite;
    font-weight: 600;
    font-size: 14px;
  }

  :deep(.q-item__section--avatar) {
    min-width: 36px;
  }
}

.colecao-image {
  width: 120px;
  min-width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($offwhite, 0.12);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
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

  @media (max-width: 768px) {
    width: 85px;
    min-width: 85px;
    height: 85px;
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
  height: 120px;
  position: relative;

  @media (max-width: 768px) {
    height: 85px;
  }
}

.titulo-linha {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.colecao-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.text-h6 {
  margin: 0;
  color: $offwhite;
  font-size: 20px;
  font-weight: 800;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
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
  color: rgba($offwhite, 0.82);
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
  background: rgba($offwhite, 0.22);
  border: 1px solid rgba($offwhite, 0.35);
  font-size: 14px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 10px;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  white-space: nowrap;

  &.badge-loading {
    opacity: 0.7;
  }

  .colecao-card:hover & {
    background: rgba($offwhite, 0.28);
    border-color: rgba($offwhite, 0.45);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 16px;
  }
}

.badge-label {
  font-weight: 600;
  color: $offwhite;
}

.badge-value {
  font-weight: 800;
  font-size: 16px;
  color: $cumes-04;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin-left: 6px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
}
</style>
