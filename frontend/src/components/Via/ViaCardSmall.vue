<template>
  <q-card-section v-if="props.via" class="card-info">
    <div class="left-section">
      <div class="imagem-via" />
    </div>
    <div class="right-section">
      <div class="via-nome">{{ props.via.nome }}</div>
      <div class="grau-extensao">
        <span>{{ props.via.grau }}</span>/
        <span>{{ props.via.extensao }}m</span>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps<{ via: Via }>();

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-info {
  display: flex;
  align-items: center;
  background-color: $dark;
  color: white;
}

.left-section {
  flex: 0 0 100px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
}

.via-nome {
  font-size: 22px;
  font-weight: bold;
}

.grau-extensao {
  width: 100px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.imagem-via {
  width: 100px;
  height: 100px;
  border: #1c1c1c 5px solid;
  border-radius: 10px;
  object-fit: cover;
}
</style>
