<template>
  <q-card
    class="surprise-card"
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
        <i class="pi pi-question card-icon"></i>
      </div>
      <div class="card-content">
        <div class="card-title">Surpresa!</div>
        <div class="card-subtitle">Uma via aleatória</div>
      </div>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ViaService from 'src/services/ViaService';

const props = defineProps<{
  loading?: boolean;
}>();

const router = useRouter();
const fetching = ref(false);

const handleClick = async () => {
  if (props.loading || fetching.value) return;
  fetching.value = true;
  try {
    const via = await ViaService.getRandomVia();
    router.push({ name: 'ViaDetalhada', params: { id: via.id.toString() } });
  } catch {
    // Silently fail - user can try again
  } finally {
    fetching.value = false;
  }
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.surprise-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background: linear-gradient(135deg, rgba($cumes-04, 0.15) 0%, rgba($cumes-01, 0.12) 100%);
  box-shadow: 0 4px 12px $box-shadow-soft;
  border: 2px solid rgba($cumes-04, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:not(.loading):hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px $box-shadow-medium;
    border-color: $cumes-04;

    .card-icon {
      transform: scale(1.2) rotate(15deg);
    }

    .card-image-wrapper {
      background: linear-gradient(135deg, rgba($cumes-04, 0.35) 0%, rgba($cumes-03, 0.3) 100%);
    }
  }

  &.loading {
    cursor: default;
  }
}

.card-image-wrapper {
  background: linear-gradient(135deg, rgba($cumes-04, 0.25) 0%, rgba($cumes-01, 0.2) 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  .card-icon {
    font-size: 72px;
    color: $cumes-04;
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
  opacity: 0.9;
}

.card-content-skeleton {
  padding: 20px;
}
</style>
