<template>
  <q-card
    class="category-card"
    :class="{ 'loading': loading }"
    @click="handleClick"
  >
    <!-- Skeleton Loading -->
    <template v-if="loading">
      <q-skeleton height="200px" />
      <div class="card-content-skeleton">
        <q-skeleton type="text" width="70%" />
        <q-skeleton type="text" width="50%" />
      </div>
    </template>

    <!-- Card Content -->
    <template v-else>
      <div class="card-image-wrapper">
        <q-icon name="collections" class="card-icon" />
      </div>
      
      <div class="card-content">
        <div class="card-title">{{ card.title }}</div>
        <div class="card-count">
          <span class="count-number">{{ card.count }}</span>
          <span class="count-label">vias</span>
        </div>
      </div>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { Card } from 'pages/Home.vue';

const props = defineProps<{
  card: Card;
  loading?: boolean;
}>();

const emit = defineEmits<{
  navigate: [filterType: string];
}>();

const handleClick = () => {
  if (!props.loading) {
    emit('navigate', props.card.filterType);
  }
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.category-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background: $offwhite;
  box-shadow: 0 4px 12px $box-shadow-soft;
  border: 2px solid transparent;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:not(.loading):hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px $box-shadow-medium;
    border-color: $cumes-01;

    .card-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .card-image-wrapper {
      background: linear-gradient(135deg, rgba($cumes-01, 0.15) 0%, rgba($cumes-03, 0.15) 100%);
    }
  }

  &.loading {
    cursor: default;
  }
}

.card-image-wrapper {
  background: linear-gradient(135deg, rgba($cumes-01, 0.08) 0%, rgba($cumes-03, 0.08) 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $cumes-01 0%, $cumes-03 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .category-card:hover &::after {
    opacity: 1;
  }
}

.card-icon {
  font-size: 72px;
  color: $cumes-03;
  transition: all 0.3s ease;
}

.card-content {
  padding: 24px 20px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $cumes-01;
  margin-bottom: 12px;
  line-height: 1.3;
}

.card-count {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;

  .count-number {
    font-size: 2rem;
    font-weight: 800;
    color: $cumes-03;
    line-height: 1;
  }

  .count-label {
    font-size: 0.95rem;
    color: $cumes-03;
    font-weight: 600;
    opacity: 0.85;
  }
}

.card-content-skeleton {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .card-image-wrapper {
    padding: 40px 32px;
  }

  .card-icon {
    font-size: 56px;
  }

  .card-content {
    padding: 20px 16px;
  }

  .card-title {
    font-size: 1.05rem;
  }

  .card-count .count-number {
    font-size: 1.75rem;
  }
}
</style>

