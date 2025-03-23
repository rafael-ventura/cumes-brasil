<template>
  <div class="mosaic">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="mosaic-card"
    >
      <q-card @click="$emit('navigate', card.filterType)">
        <q-img :src="card.image" :alt="card.title" class="card-image">
          <div class="absolute-bottom text-left card-content">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-subtitle">
              <span class="span-count-vias text-weight-bolder">
                {{ card.count }}
              </span>
              vias encontradas
            </div>
          </div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'pages/Home.vue';

defineProps({
  cards: {
    type: Array as () => Card[],
    required: true
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.mosaic {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.mosaic-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
}

.card-image {
  height: 250px;
  object-fit: cover;
  position: relative;
}

.card-content {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 10px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.card-subtitle {
  font-size: 14px;
  opacity: 0.8;
}
</style>
