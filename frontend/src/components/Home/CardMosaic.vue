<template>
  <div class="mosaic-container">
    <div class="mosaic-grid">
      <CategoryCard
        v-for="(card, index) in cards"
        :key="index"
        :card="card"
        :loading="loading"
        @navigate="handleNavigate"
        class="mosaic-item"
        :style="{ animationDelay: `${index * 100}ms` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'pages/Home.vue';
import CategoryCard from './CategoryCard.vue';

defineProps<{
  cards: Card[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  navigate: [filterType: string];
}>();

const handleNavigate = (filterType: string) => {
  emit('navigate', filterType);
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
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  // Primeira linha: 3 cards (cada um ocupa 2 colunas)
  .mosaic-item:nth-child(1),
  .mosaic-item:nth-child(2),
  .mosaic-item:nth-child(3) {
    grid-column: span 2;
  }

  // Segunda linha: 2 cards centralizados (cada um ocupa 2 colunas, com 1 coluna vazia em cada lado)
  .mosaic-item:nth-child(4) {
    grid-column: 2 / span 2;
  }

  .mosaic-item:nth-child(5) {
    grid-column: 4 / span 2;
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

    .mosaic-item:nth-child(1),
    .mosaic-item:nth-child(2),
    .mosaic-item:nth-child(3),
    .mosaic-item:nth-child(4),
    .mosaic-item:nth-child(5) {
      grid-column: span 1;
    }
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

    .mosaic-item:nth-child(1),
    .mosaic-item:nth-child(2),
    .mosaic-item:nth-child(3),
    .mosaic-item:nth-child(4),
    .mosaic-item:nth-child(5) {
      grid-column: span 1;
    }
  }
}

@media (max-width: 480px) {
  .mosaic-container {
    padding: 0 12px;
  }
}
</style>
