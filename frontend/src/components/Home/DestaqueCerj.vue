<template>
  <div class="destaque-cerj">
    <div class="section-header">
      <h2 class="section-title">
        <i class="pi pi-star-fill title-icon"></i>
        Clássicas do CERJ em destaque
      </h2>
      <p class="section-subtitle">
        Vias clássicas selecionadas pelo Clube Excursionista do Rio de Janeiro
      </p>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-spinner"></i>
      <p class="loading-text">Carregando vias clássicas...</p>
    </div>

    <div v-else-if="vias.length > 0" class="cerj-content">
      <div class="vias-grid">
        <ViaCard
          v-for="via in vias"
          :key="via.id"
          :via="via"
          class="via-card-item"
          @click="goToVia(via.id)"
        />
      </div>
      <div class="ver-todas-wrapper">
        <button class="ver-todas-btn" @click="goToCerjSearch">
          Ver todas as {{ totalCount }} clássicas
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-info-circle empty-icon"></i>
      <p>Nenhuma via clássica do CERJ encontrada.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeService from 'src/services/HomeService';
import ViaCard from 'src/components/Via/ViaCard.vue';
import { Via } from 'src/models/Via';

const router = useRouter();
const vias = ref<Via[]>([]);
const loading = ref(true);
const totalCount = ref(0);

onMounted(async () => {
  try {
    loading.value = true;
    const [cerjVias, count] = await Promise.all([
      HomeService.getCerjVias(6),
      HomeService.getCount('via_cerj=true')
    ]);
    vias.value = cerjVias;
    totalCount.value = count;
  } catch (error) {
    console.error('Erro ao carregar destaque CERJ:', error);
  } finally {
    loading.value = false;
  }
});

const goToVia = (id: number) => {
  router.push({ name: 'ViaDetalhada', params: { id: id.toString() } });
};

const goToCerjSearch = () => {
  router.push({
    name: 'busca',
    query: { filterType: 'via_cerj=true' }
  });
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.destaque-cerj {
  margin: 0 24px 80px;
  padding: 40px 24px;
  background: linear-gradient(135deg, rgba($cumes-04, 0.06) 0%, rgba($cumes-01, 0.04) 100%);
  border-radius: 24px;
  border: 2px solid rgba($cumes-01, 0.15);
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: $cumes-01;
  margin: 0 0 8px 0;

  .title-icon {
    color: $cumes-04;
    font-size: 1.2em;
  }
}

.section-subtitle {
  font-size: 1rem;
  color: $cumes-03;
  margin: 0;
  opacity: 0.85;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;

  .loading-spinner {
    font-size: 40px;
    color: $cumes-04;
    margin-bottom: 16px;
  }

  .loading-text {
    color: $cumes-03;
    font-size: 15px;
    margin: 0;
  }
}

.vias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.via-card-item {
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.ver-todas-wrapper {
  text-align: center;
}

.ver-todas-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: $cumes-01;
  color: $offwhite;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px $box-shadow-medium;

  &:hover {
    background: darken($cumes-01, 8%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px $box-shadow-strong;
  }

  i {
    font-size: 14px;
  }
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: $cumes-03;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  p {
    margin: 0;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .destaque-cerj {
    margin: 0 16px 60px;
    padding: 32px 16px;
  }

  .vias-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
