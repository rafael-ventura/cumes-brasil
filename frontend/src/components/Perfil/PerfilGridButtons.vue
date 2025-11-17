<template>
  <div class="stats-container">
    <router-link
      v-for="(item, index) in items"
      :key="index"
      :to="item.to"
      class="stat-card"
      :style="{ backgroundColor: item.color }"
    >
      <div class="stat-content">
        <div class="stat-number">{{ item.num }}</div>
        <q-icon :name="item.icon" class="stat-icon" />
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">

// Recebe as props do componente pai
defineProps<{
  items: Array<{ label: string; num: number; icon: string; color: string; to: string }>;
}>();
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.stats-container {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  flex-wrap: nowrap;

  @media (min-width: 1024px) {
    gap: 10px;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 10px;
  min-width: 0;
  min-height: 60px;
  flex: 1 1 0;
  margin: 0 !important;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px $box-shadow-dark;
  }

  @media (min-width: 1024px) {
    padding: 8px 20px;
    min-height: 40px;
    border-radius: 16px;
    flex: 1 1 0;
    min-width: 0;
    margin: 0 !important;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;

  @media (min-width: 1024px) {
    gap: 10px;
  }
}

.stat-number {
  font-size: 16px;
  font-weight: bold;
  color: $background;

  @media (min-width: 1024px) {
    font-size: 20px;
  }
}

.stat-icon {
  font-size: 18px;
  color: $background;

  @media (min-width: 1024px) {
    font-size: 20px;
  }
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: $background;
  white-space: nowrap;

  @media (min-width: 1024px) {
    font-size: 14px;
  }
}
</style>
