<template>
  <div class="stats-bar">
    <div
      v-for="(stat, index) in stats"
      :key="stat.label"
      class="stat-item"
      :class="{ 'animate': animated }"
      :style="{ animationDelay: `${index * 100}ms` }"
    >
      <q-icon
        :name="stat.icon"
        size="32px"
        class="stat-icon"
        :color="stat.color"
      />
      
      <div class="stat-number">
        <template v-if="loading">
          <q-skeleton type="text" width="60px" height="40px" />
        </template>
        <template v-else>
          {{ formatNumber(stat.value) }}
        </template>
      </div>
      
      <div class="stat-label">{{ stat.label }}</div>
    </div>

    <!-- Dividers (ocultos no mobile) -->
    <div
      v-for="i in stats.length - 1"
      :key="`divider-${i}`"
      class="stat-divider"
      :style="{ gridColumn: i * 2 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

export interface Stat {
  icon: string;
  value: number;
  label: string;
  color: string;
}

const props = defineProps<{
  stats: Stat[];
  loading?: boolean;
}>();

const animated = ref(false);

onMounted(() => {
  setTimeout(() => {
    animated.value = true;
  }, 100);
});

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.stats-bar {
  position: relative;
  z-index: 2;
  background: white;
  border-radius: 16px;
  padding: 40px 24px;
  margin: 0 auto;
  max-width: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  
  &.animate {
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  margin-bottom: 4px;
  opacity: 0.9;
  transition: transform 0.3s ease;
  
  .stat-item:hover & {
    transform: scale(1.1);
  }
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: $cumes-01;
  line-height: 1;
  letter-spacing: -0.02em;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 0.8rem;
  color: $cumes-03;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  opacity: 0.9;
}

.stat-divider {
  display: none;
}

// Desktop: mostrar dividers
@media (min-width: 769px) {
  .stat-divider {
    display: block;
    width: 2px;
    height: 60px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba($cumes-03, 0.2),
      transparent
    );
  }
}

// Mobile
@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    padding: 32px 20px;
    gap: 24px;
  }

  .stat-item {
    padding: 16px 0;
    width: 100%;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-divider {
    width: 80%;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      rgba($cumes-03, 0.2),
      transparent
    );
  }
}
</style>

