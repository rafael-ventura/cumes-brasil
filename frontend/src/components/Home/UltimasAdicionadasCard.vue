<template>
  <q-card
    class="ultimas-card"
    :class="{ 'loading': loading }"
    @click="handleClick"
  >
    <template v-if="loading">
      <q-skeleton height="200px" />
      <div class="card-content-skeleton">
        <q-skeleton type="text" width="70%" />
      </div>
    </template>

    <template v-else>
      <div class="card-image-wrapper">
        <i class="pi pi-clock card-icon"></i>
      </div>
      <div class="card-content">
        <div class="card-title">Últimas adicionadas</div>
        <div class="card-subtitle">Vias mais recentes</div>
      </div>
    </template>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  navigate: [payload: string | { sortField: string; sortOrder: string }];
}>();

const handleClick = () => {
  emit('navigate', { sortField: 'created_at', sortOrder: 'DESC' });
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.ultimas-card {
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
      transform: scale(1.15);
    }

    .card-image-wrapper {
      background: linear-gradient(135deg, rgba($cumes-01, 0.30) 0%, rgba($cumes-03, 0.28) 100%);
    }
  }

  &.loading {
    cursor: default;
  }
}

.card-image-wrapper {
  background: linear-gradient(135deg, rgba($cumes-01, 0.20) 0%, rgba($cumes-03, 0.18) 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  .card-icon {
    font-size: 72px;
    color: $cumes-03;
    transition: all 0.3s ease;
  }
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
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 0.9rem;
  color: $cumes-03;
  font-weight: 500;
  opacity: 0.85;
}

.card-content-skeleton {
  padding: 20px;
}
</style>
