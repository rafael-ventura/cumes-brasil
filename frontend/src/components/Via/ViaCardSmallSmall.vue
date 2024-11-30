<template>
  <q-card-section v-if="props.via" class="card-info">
    <div class="section">
      <div class="via-nome">{{ props.via.nome }}</div>
      <GrauBadge :via="props.via" />
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Via } from 'src/models/Via';
import GrauBadge from 'components/Via/GrauBadge.vue';

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

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.via-nome {
  font-size: 22px;
  font-weight: bold;
}

</style>
