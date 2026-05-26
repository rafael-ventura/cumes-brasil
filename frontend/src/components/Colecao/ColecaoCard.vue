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

        <div class="vias-count">
          <span v-if="viasCarregadas !== null" class="vias-count__texto">{{ viasCarregadas }} vias</span>
          <span v-else class="vias-count__texto vias-count__texto--loading">Carregando...</span>
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
  return url ? ImagemService.obterUrlCompleta(url) : null;
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
  min-height: 120px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px $box-shadow-soft;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px $box-shadow-medium;
    border-color: rgba($cumes-01, 0.35);
  }

  @media (max-width: 768px) {
    min-height: 100px;
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
  width: 80px;
  min-width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($offwhite, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  transition: all 0.25s ease;
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
    width: 64px;
    min-width: 64px;
    height: 64px;
  }
}

.colecao-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: $offwhite;
  flex-grow: 1;
  min-width: 0;
  gap: 8px;
  height: 80px;
  position: relative;

  @media (max-width: 768px) {
    height: 64px;
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
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 15px;
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

.vias-count {
  margin-top: auto;
}

.vias-count__texto {
  font-size: 12px;
  color: rgba($offwhite, 0.45);
  font-weight: 600;

  &--loading {
    opacity: 0.6;
  }
}
</style>
