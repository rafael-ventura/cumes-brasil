<template>
  <q-card-section v-if="props.via" class="card-info">
    <div class="section">
      <div class="via-nome-row">
        <span class="via-nome">{{ props.via.nome }}</span>
        <BadgeCerj v-if="props.via.via_cerj" :via="props.via" />
      </div>
      <GrauBadge :via="props.via" />
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { Via } from 'src/models/Via';
import GrauBadge from 'components/Via/GrauBadge.vue';
import BadgeCerj from 'components/Via/BadgeCerj.vue';

const props = defineProps<{ via: Via }>();

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-info {
  display: flex;
  align-items: center;
  background-color: $background;
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

.via-nome-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.via-nome {
  font-size: 22px;
  font-weight: bold;
}

</style>
