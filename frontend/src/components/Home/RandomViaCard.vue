<template>
  <div class="random-via-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner-dots color="primary" size="50px" />
      <p class="loading-text">Buscando uma via aleatória...</p>
    </div>

    <!-- Error State -->
    <ErrorHandler
      :error="error"
      :show-notification="false"
      @close="clearError"
    />

    <!-- Via Card -->
    <div v-if="via && !loading" class="via-card-wrapper">
      <div class="card-header">
        <h3 class="card-title">Via Aleatória Encontrada</h3>
      </div>

      <ViaCard
        :via="via"
        @click="navigateToVia"
        class="random-via-card"
      />

      <div class="card-actions">
        <q-btn
          label="Ver Detalhes"
          color="primary"
          @click="navigateToVia"
          class="action-btn"
        />
        <q-btn
          label="Outra Via"
          color="secondary"
          outline
          @click="fetchRandomVia"
          :loading="loading"
          class="action-btn"
        />
      </div>
    </div>

    <!-- Initial State -->
    <div v-if="!via && !loading && !error" class="initial-state">
      <q-btn
        icon="shuffle"
        color="primary"
        class="random-btn"
        @click="fetchRandomVia"
        :loading="loading"
      />
      <p class="initial-text">Clique para descobrir uma via aleatória</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ViaCard from 'src/components/Via/ViaCard.vue';
import ErrorHandler from 'src/components/ErrorHandler.vue';
import ViaService from 'src/services/ViaService';
import { Via } from 'src/models/Via';

const router = useRouter();

const via = ref<Via | null>(null);
const loading = ref(false);
const error = ref<Error | null>(null);

const fetchRandomVia = async () => {
  loading.value = true;
  error.value = null;

  try {
    const randomVia = await ViaService.getRandomVia();
    via.value = randomVia;
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Erro ao buscar via aleatória');
  } finally {
    loading.value = false;
  }
};

const navigateToVia = () => {
  if (via.value) {
    router.push({
      name: 'via-detalhada',
      params: { id: via.value.id.toString() }
    });
  }
};

const clearError = () => {
  error.value = null;
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.random-via-container {
  margin: 20px 0;
  padding: 20px;
  border: 2px solid $cumes-04;
  border-radius: 15px;
  background: rgba($cumes-05, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .loading-text {
    margin-top: 16px;
    color: $cumes-04;
    font-size: 16px;
    font-weight: 500;
  }
}

.via-card-wrapper {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .card-title {
      color: $cumes-04;
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
  }

  .random-via-card {
    margin-bottom: 16px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;

    .action-btn {
      min-width: 120px;
    }
  }
}

.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;

  .random-btn {
    border-radius: 100%;
    width: 60px;
    height: 60px;
    color: black;
    background: $cumes-02;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    margin-bottom: 16px;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  }

  .initial-text {
    color: $cumes-04;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin: 0;
  }
}

// Responsividade
@media (max-width: 768px) {
  .random-via-container {
    margin: 16px 8px;
    padding: 16px;
  }

  .card-actions {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
