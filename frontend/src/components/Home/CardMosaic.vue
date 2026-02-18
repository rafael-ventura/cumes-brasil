<template>
  <div class="mosaic-container">
    <div class="mosaic-grid">
      <CategoryCard
        v-for="(card, index) in cards"
        :key="`cat-${index}`"
        :card="card"
        :loading="loading"
        @navigate="handleNavigate"
        class="mosaic-item"
        :style="{ animationDelay: `${index * 80}ms` }"
      />
      <SurpriseCard
        :loading="loading"
        class="mosaic-item mosaic-surprise"
        :style="{ animationDelay: `${cards.length * 80}ms` }"
      />
      <UltimasAdicionadasCard
        :loading="loading"
        @navigate="handleNavigate"
        class="mosaic-item mosaic-ultimas"
        :style="{ animationDelay: `${(cards.length + 1) * 80}ms` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'pages/Home.vue';
import CategoryCard from './CategoryCard.vue';
import SurpriseCard from './SurpriseCard.vue';
import UltimasAdicionadasCard from './UltimasAdicionadasCard.vue';

defineProps<{
  cards: Card[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  navigate: [filterType: string | { sortField: string; sortOrder: string }];
}>();

const handleNavigate = (payload: string | { sortField: string; sortOrder: string }) => {
  emit('navigate', payload);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.mosaic-container {
  padding: 0 24px;
  margin-bottom: 40px;
}

.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  // Todos os cards ocupam 1 coluna no desktop
  .mosaic-item {
    grid-column: span 1;
  }
}

.mosaic-item {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsividade
@media (max-width: 1024px) {
  .mosaic-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .mosaic-container {
    padding: 0 16px;
    margin-bottom: 32px;
  }

  .mosaic-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .mosaic-container {
    padding: 0 12px;
  }
}
</style>
