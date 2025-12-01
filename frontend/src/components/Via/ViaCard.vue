<template>
  <div v-if="via">
    <q-card class="card-item" @click="emitClick">
      <div class="card-image-container">
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
          <q-icon class="localizacao-icon" name="location_on" size="20px" />
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
import { Via } from 'src/models/Via';
import { getViaImageUrlFull } from 'src/utils/utils';

const props = defineProps<{ via: Via }>();
const emits = defineEmits(['click']);

const viaImageUrl = computed(() => getViaImageUrlFull(props.via));

const emitClick = () => {
  props.via.nome &&
  emits('click');
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-item {
  border-radius: 12px;
  background-color: $background;
  width: 100%;
  height: 315px;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px $box-shadow-medium;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px $box-shadow-strong;
  }
}

.card-image-container {
  width: 100%;
  height: 175px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $cumes-02;
  color: $offwhite;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-item:hover .card-image {
  transform: scale(1.05);
}

.card-info {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 5%) 100%);
  padding: 12px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.via-nome {
  font-size: 20px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;
  line-height: 1.2;
}

.localizacao-info {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: $offwhite;
  opacity: 0.95;
}

.localizacao-icon {
  margin-right: 8px;
  color: $cumes-04;
}

.grau-badge-container {
  display: flex;
  justify-content: center;
}
</style>
