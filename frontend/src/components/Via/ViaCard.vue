<template>
  <div v-if="via">
    <q-card class="card-item" @click="emitClick">
      <div class="card-image-container">
        <img :src="via.imagem.url" class="card-image" alt="via image" />
      </div>
      <q-card-section class="card-info">
        <div class="via-nome">{{ via.nome }}</div>
        <div class="montanha-face">
          <q-icon class="montanha-icon" name="terrain" size="20px" />
          {{ via.montanha.nome }}<span v-if="via.face && via.face.nome">, {{ via.face.nome }}</span>
        </div>
        <div class="grau-badge-container">
          <GrauBadge :via="via" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import { Via } from 'src/models/Via';

const props = defineProps<{ via: Via }>();
const emits = defineEmits(['click']);

const emitClick = () => {
  props.via.nome &&
  emits('click');
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-item {
  border-radius: 10px;
  background-color: $background;
  width: 100%;
  height: 315px;
  margin: 0;
  padding: 0;
}

.card-image-container {
  width: 100%;
  height: 175px;
}

.card-image {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
}

.card-info {
  background-color: rgba($cumes-01, 0.9);
  padding: 10px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.via-nome {
  font-size: 22px;
  font-weight: bold;
  color: black;
}

.montanha-face {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: black;
}

.montanha-icon {
  margin-right: 10px;
}

.grau-badge-container {
  display: flex;
  justify-content: center;
}
</style>
