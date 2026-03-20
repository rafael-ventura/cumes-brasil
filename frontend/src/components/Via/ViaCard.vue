<template>
  <div v-if="via">
    <q-card
      class="card-item"
      :class="{ 'card-item--selecionada': modoSelecao && selecionada }"
      @click="emitClick"
    >
      <div class="card-image-container">
        <div v-if="modoSelecao" class="selecao-check" aria-hidden="true">
          <i :class="selecionada ? 'pi pi-check-circle' : 'pi pi-circle'" />
        </div>
        <BadgeCerj v-if="via.via_cerj" :via="via" class="badge-cerj-overlay" />
        <img 
          v-if="viaImageUrl" 
          :src="viaImageUrl" 
          class="card-image" 
          alt="via image"
          loading="lazy"
        />
        <div v-else class="card-image-placeholder">
          <q-icon name="image" size="48px" />
        </div>
      </div>
      <q-card-section class="card-info">
        <div class="via-nome">{{ via.nome }}</div>
        <div class="localizacao-info" v-if="via.localizacao">
          <q-icon class="localizacao-icon" name="location_on" size="14px" />
          <span v-if="via.localizacao.estado">{{ via.localizacao.estado.sigla }}</span>
          <span v-if="via.localizacao.cidade">, {{ via.localizacao.cidade.nome }}</span>
          <span v-if="via.localizacao.bairro">, {{ via.localizacao.bairro.nome }}</span>
        </div>
        <div class="grau-badge-container">
          <GrauBadge :via="via" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import BadgeCerj from 'src/components/Via/BadgeCerj.vue';
import { Via } from 'src/models/Via';
import { getViaImageUrlFull } from 'src/utils/utils';

const props = withDefaults(
  defineProps<{
    via: Via;
    modoSelecao?: boolean;
    selecionada?: boolean;
  }>(),
  { modoSelecao: false, selecionada: false }
);
const emits = defineEmits(['click', 'toggle-selecao']);

const viaImageUrl = computed(() => getViaImageUrlFull(props.via));

const emitClick = () => {
  if (props.modoSelecao) {
    emits('toggle-selecao');
    return;
  }
  if (props.via.nome) emits('click');
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-item {
  border-radius: 14px;
  background-color: $background;
  width: 100%;
  margin: 0;
  padding: 0;
  box-shadow: 0 2px 8px $box-shadow-soft;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px $box-shadow-strong;
  }

  &--selecionada {
    box-shadow:
      0 0 0 2px rgba($cumes-03, 0.95),
      0 10px 28px rgba($cumes-03, 0.18);
    background: linear-gradient(180deg, rgba($cumes-03, 0.06) 0%, $background 100%);
  }
}

.selecao-check {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: $offwhite;
  background: rgba($cumes-01, 0.88);
  border: 2px solid rgba($offwhite, 0.35);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.card-image-container {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
}

.badge-cerj-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $cumes-02;
  color: $offwhite;
}

.card-item:hover .card-image {
  transform: scale(1.06);
}

.card-info {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 5%) 100%);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.via-nome {
  font-size: 15px;
  font-weight: 700;
  color: $offwhite;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.localizacao-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba($offwhite, 0.8);
  line-height: 1.3;
  gap: 2px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.localizacao-icon {
  flex-shrink: 0;
  margin-right: 4px;
  color: $cumes-04;
  font-size: 14px !important;
}

.grau-badge-container {
  display: flex;
  margin-top: 2px;
}
</style>
