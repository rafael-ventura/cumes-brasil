<template>
  <q-card-section v-if="props.via" class="card-info">
    <div class="left-section">
      <div class="imagem-via" />
    </div>
    <div class="right-section">
      <div class="via-nome">{{ props.via.nome }}</div>
      <GrauBadge :via="props.via"/>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { Via } from 'src/models/Via';
import GrauBadge from 'components/Via/GrauBadge.vue';

const props = defineProps<{ via: Via }>();

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-info {
  display: flex;
  align-items: center;
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

.imagem-via {
  width: 100px;
  height: 100px;
  border: #1c1c1c 5px solid;
  border-radius: 10px;
  object-fit: cover;
}
</style>
