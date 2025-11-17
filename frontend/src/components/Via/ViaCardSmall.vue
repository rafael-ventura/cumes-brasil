<template>
  <q-card-section v-if="props.via" class="card-info">
    <div class="left-section">
      <div class="imagem-container">
        <img 
          v-if="viaImageUrl" 
          :src="viaImageUrl" 
          class="imagem-via" 
          alt="via image"
        />
        <div v-else class="imagem-placeholder">
          <q-icon name="image" size="32px" />
        </div>
      </div>
    </div>
    <div class="right-section">
      <div class="via-nome">{{ props.via.nome }}</div>
      <div class="montanha-info" v-if="props.via.montanha">
        <q-icon name="terrain" size="14px" class="montanha-icon" />
        <span>{{ props.via.montanha.nome }}</span>
      </div>
      <div class="grau-container">
        <GrauBadge :via="props.via"/>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Via } from 'src/models/Via';
import GrauBadge from 'components/Via/GrauBadge.vue';
import { getViaImageUrlFull } from 'src/utils/utils';

const props = defineProps<{ via: Via }>();

const viaImageUrl = computed(() => getViaImageUrlFull(props.via));

</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.card-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 5%) 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px $box-shadow-medium;
  border: 2px solid rgba($cumes-01, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px $box-shadow-strong;
    border-color: rgba($cumes-01, 0.6);
  }
}

.left-section {
  flex: 0 0 120px;
}

.imagem-container {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($offwhite, 0.2);
  box-shadow: 0 4px 12px $box-shadow-medium;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  .card-info:hover & {
    transform: scale(1.03);
    box-shadow: 0 6px 16px $box-shadow-strong;
  }
}

.imagem-via {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-info:hover .imagem-via {
  transform: scale(1.05);
}

.imagem-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($offwhite, 0.2);
  color: rgba($background, 0.6);
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.via-nome {
  font-size: 20px;
  font-weight: 800;
  color: $background;
  text-shadow: 0 2px 4px $text-shadow-default;
  line-height: 1.3;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.montanha-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba($background, 0.8);
  font-weight: 500;
  
  .montanha-icon {
    color: $cumes-03;
  }
}

.grau-container {
  margin-top: 4px;
}
</style>
