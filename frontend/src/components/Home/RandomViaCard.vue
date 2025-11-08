<template>
  <div class="random-via-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-spinner"></i>
      <p class="loading-text">Buscando uma via aleatória...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-container">
      <i class="pi pi-exclamation-circle error-icon"></i>
      <p class="error-text">{{ error.message }}</p>
      <button class="retry-btn" @click="fetchRandomVia">
        <i class="pi pi-refresh"></i>
        Tentar novamente
      </button>
    </div>

    <!-- Via Card -->
    <div v-if="via && !loading && !error" class="via-card-wrapper">
      <div class="card-header">
        <i class="pi pi-star-fill card-icon"></i>
        <h3 class="card-title">Sua via aleatória</h3>
      </div>

      <ViaCard
        :via="via"
        @click="navigateToVia"
        class="random-via-card"
      />

      <div class="card-actions">
        <button class="action-btn primary" @click="navigateToVia">
          <i class="pi pi-eye"></i>
          Ver Detalhes
        </button>
        <button class="action-btn secondary" @click="fetchRandomVia" :disabled="loading">
          <i class="pi pi-refresh"></i>
          Outra Via
        </button>
      </div>
    </div>

    <!-- Initial State -->
    <div v-if="!via && !loading && !error" class="initial-state">
      <div class="random-btn-wrapper">
        <button class="random-btn" @click="fetchRandomVia" :disabled="loading">
          <i class="pi pi-question"></i>
        </button>
        <div class="pulse-ring"></div>
      </div>
      <h3 class="initial-title">Surpresa!</h3>
      <p class="initial-text">Descubra uma via aleatória e aventure-se pelo desconhecido</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ViaCard from 'src/components/Via/ViaCard.vue';
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
      name: 'ViaDetalhada',
      params: { id: via.value.id.toString() }
    });
  }
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.random-via-container {
  max-width: 600px;
  margin: 0 auto 60px;
  padding: 24px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

// ============================================
// LOADING STATE
// ============================================
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .loading-spinner {
    font-size: 48px;
    color: $cumes-04;
    margin-bottom: 20px;
  }

  .loading-text {
    color: $cumes-03;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }
}

// ============================================
// ERROR STATE
// ============================================
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;

  .error-icon {
    font-size: 48px;
    color: #e74c3c;
    margin-bottom: 16px;
  }

  .error-text {
    color: $cumes-03;
    font-size: 16px;
    margin: 0 0 20px 0;
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: $cumes-04;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: darken($cumes-04, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    i {
      font-size: 16px;
    }
  }
}

// ============================================
// VIA CARD WRAPPER
// ============================================
.via-card-wrapper {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba($cumes-04, 0.1);

    .card-icon {
      font-size: 24px;
      color: $cumes-04;
    }

    .card-title {
      color: $cumes-01;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }

  .random-via-card {
    margin-bottom: 24px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      i {
        font-size: 16px;
      }

      &.primary {
        background: $cumes-01;
        color: white;

        &:hover {
          background: darken($cumes-01, 10%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }

      &.secondary {
        background: white;
        color: $cumes-01;
        border: 2px solid $cumes-01;

        &:hover {
          background: $cumes-01;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }
}

// ============================================
// INITIAL STATE
// ============================================
.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;

  .random-btn-wrapper {
    position: relative;
    margin-bottom: 32px;

    .random-btn {
      position: relative;
      z-index: 2;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, $cumes-04 0%, lighten($cumes-04, 10%) 100%);
      color: white;
      cursor: pointer;
      transition: all 0.4s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 48px;
      }

      &:hover {
        transform: scale(1.1) rotate(10deg);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: scale(1.05) rotate(5deg);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $cumes-04;
      opacity: 0;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.5;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.8);
        opacity: 0;
      }
    }
  }

  .initial-title {
    font-size: 28px;
    font-weight: 800;
    color: $cumes-01;
    margin: 0 0 12px 0;
    letter-spacing: -0.01em;
  }

  .initial-text {
    color: $cumes-03;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    max-width: 400px;
    line-height: 1.5;
  }
}

// ============================================
// RESPONSIVIDADE
// ============================================
@media (max-width: 768px) {
  .random-via-container {
    margin: 0 16px 40px;
    padding: 20px;
  }

  .via-card-wrapper {
    .card-actions {
      grid-template-columns: 1fr;
    }
  }

  .initial-state {
    padding: 40px 16px;

    .random-btn-wrapper {
      .random-btn {
        width: 80px;
        height: 80px;

        i {
          font-size: 40px;
        }
      }

      .pulse-ring {
        width: 80px;
        height: 80px;
      }
    }

    .initial-title {
      font-size: 24px;
    }

    .initial-text {
      font-size: 15px;
    }
  }
}
</style>
