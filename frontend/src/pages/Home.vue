<template>
  <q-page class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <i class="pi pi-map hero-icon"></i>
        <h1 class="hero-title">
          Explore as <span class="highlight">Montanhas</span><br/>
          do Brasil
        </h1>
        <p class="hero-subtitle">
          Descubra rotas, conecte-se com escaladores e registre suas conquistas
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stats-grid">
        <div v-for="stat in statsData" :key="stat.label" class="stat-card">
          <div class="stat-card-content">
            <i :class="`pi ${getPrimeIcon(stat.icon)}`" class="stat-icon"></i>
            <div class="stat-value">
              <span v-if="loadingStats" class="pi pi-spin pi-spinner"></span>
              <span v-else>{{ stat.value }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <h2 class="section-title">Explore por categoria</h2>
      <p class="section-subtitle">Encontre vias perfeitas para seu nível</p>
    </div>

    <!-- Mosaico de Cards -->
    <CardMosaic
      :cards="cards"
      :loading="loadingCards"
      @navigate="goToFilteredSearch"
    />

    <!-- Section Header Random -->
    <div class="section-header random-section">
      <h2 class="section-title">Feeling aventureiro?</h2>
      <p class="section-subtitle">Deixe o destino escolher sua próxima escalada</p>
    </div>

    <!-- Componente de Via Aleatória -->
    <RandomViaCard />

  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import HomeService from 'src/services/HomeService';
import CardMosaic from 'src/components/Home/CardMosaic.vue';
import RandomViaCard from 'src/components/Home/RandomViaCard.vue';
import { useRouter } from 'vue-router';
import CopacabanaImage from 'src/assets/home/copacabana.webp';
import TerceiroGrauImage from 'src/assets/home/terceiroGrau.webp';
import ExposicaoE2Image from 'src/assets/home/exposicaoE2.webp';
import DuracaoRapidaImage from 'src/assets/home/duracao-rapida.webp';
import UrcaImage from 'src/assets/home/urca.webp';

const router = useRouter();
defineOptions({
  name: 'HomePage'
});

export interface Card {
  title: string;
  filterType: string;
  count: number;
  image: any;
}

// Estados de loading
const loadingCards = ref(true);
const loadingStats = ref(true);

const cards = ref<Card[]>([
  {
    title: 'Vias em Copacabana',
    filterType: 'bairro=copacabana',
    count: 0,
    image: CopacabanaImage
  },
  {
    title: 'Vias de Terceiro Grau',
    filterType: 'grau=3',
    count: 0,
    image: TerceiroGrauImage
  },
  {
    title: 'Vias com Exposição até E2',
    filterType: 'exposicao=E2',
    count: 0,
    image: ExposicaoE2Image
  },
  {
    title: 'Vias com Duração Rápida',
    filterType: 'duracao=d1',
    count: 0,
    image: DuracaoRapidaImage
  },
  {
    title: 'Vias no Bairro da Urca',
    filterType: 'bairro=urca',
    count: 0,
    image: UrcaImage
  }
]);

// Stats dinâmicos
const totalVias = computed(() => cards.value.reduce((acc, card) => acc + card.count, 0));
const totalMontanhas = ref(0);
const totalEscaladores = ref(0);

const statsData = computed(() => [
  {
    icon: 'route',
    value: totalVias.value,
    label: 'Vias Catalogadas',
    color: 'cumes-04'
  },
  {
    icon: 'terrain',
    value: totalMontanhas.value,
    label: 'Montanhas',
    color: 'cumes-05'
  },
  {
    icon: 'groups',
    value: totalEscaladores.value,
    label: 'Escaladores',
    color: 'cumes-03'
  }
]);

onMounted(async () => {
  // Carrega contadores dos cards em paralelo
  await loadCardsData();

  // Carrega stats (mock por enquanto)
  await loadStatsData();
});

async function loadCardsData() {
  try {
    loadingCards.value = true;

    // Carrega todos os contadores em paralelo
    const promises = cards.value.map(card =>
      HomeService.getCount(card.filterType)
    );

    const counts = await Promise.all(promises);

    cards.value.forEach((card, index) => {
      card.count = counts[index];
    });
  } catch (error) {
    console.error('Erro ao carregar dados dos cards:', error);
  } finally {
    loadingCards.value = false;
  }
}

async function loadStatsData() {
  try {
    loadingStats.value = true;

    const [montanhas, usuarios] = await Promise.all([
      HomeService.getTotalMontanhas(),
      HomeService.getTotalUsuarios()
    ]);

    totalMontanhas.value = montanhas;
    totalEscaladores.value = usuarios;
  } catch (error) {
    console.error('Erro ao carregar stats:', error);
  } finally {
    loadingStats.value = false;
  }
}

function goToFilteredSearch (filterType: string) {
  router.push({
    name: 'busca',
    query: { filterType }
  });
}

function getPrimeIcon(materialIcon: string): string {
  const iconMap: Record<string, string> = {
    'route': 'pi-map-marker',
    'terrain': 'pi-map',
    'groups': 'pi-users'
  };
  return iconMap[materialIcon] || 'pi-circle';
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.home-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  background: linear-gradient(180deg, rgba($cumes-05, 0.03) 0%, transparent 100%);
}

// ============================================
// HERO SECTION
// ============================================
.hero-section {
  position: relative;
  min-height: 550px;
  background: linear-gradient(to bottom, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 80px 24px 280px;
  margin-bottom: 0;
  overflow: visible;
  border-radius: 0 0 40px 40px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 72px;
  color: $cumes-04;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.01em;

  .highlight {
    color: $cumes-04;
    position: relative;
  }
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: 0 auto;
}

.stats-container {
  position: relative;
  z-index: 10;
  margin-top: -220px;
  padding: 0 24px;
  margin-bottom: 60px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
  }
}

.stat-card-content {
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 40px;
  color: $cumes-03;
  opacity: 0.9;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: $cumes-01;
  line-height: 1;

  .pi-spinner {
    font-size: 2rem;
    color: $cumes-03;
  }
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: $cumes-03;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}


// ============================================
// SECTION HEADERS
// ============================================
.section-header {
  text-align: center;
  margin: 56px 24px 40px;

  &.random-section {
    margin-top: 80px;
  }
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: $cumes-01;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.05rem;
  color: $cumes-03;
  margin: 0;
  opacity: 0.8;
  font-weight: 500;
}

// ============================================
// RESPONSIVIDADE
// ============================================
@media (max-width: 768px) {
  .hero-section {
    min-height: 920px;
    padding: 60px 16px 650px;
    border-radius: 0 0 32px 32px;
  }

  .hero-icon {
    font-size: 60px;
  }

  .stats-container {
    margin-top: -570px;
    margin-bottom: 40px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .stat-card-content {
    padding: 28px 24px;
  }

  .stat-value {
    font-size: 2.25rem;
  }

  .stat-icon {
    font-size: 36px;
  }

  .section-header {
    margin: 40px 16px 32px;

    &.random-section {
      margin-top: 56px;
    }
  }
}

</style>
