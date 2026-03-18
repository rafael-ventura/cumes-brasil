<template>
  <q-page class="home-page">
    <!-- Hero compacto -->
    <div class="home-hero">
      <i class="pi pi-map hero-icon" />
      <h1 class="hero-title">
        Explore as <span class="highlight">Montanhas</span><br />do Brasil
      </h1>
      <p class="hero-subtitle">
        Descubra rotas, conecte-se com escaladores e registre suas conquistas
      </p>
    </div>

    <!-- Stats inline -->
    <div class="stats-row">
      <div v-for="stat in dadosEstatisticas" :key="stat.rotulo" class="stat-chip">
        <i :class="`pi ${stat.icone}`" class="stat-icon" />
        <span v-if="carregandoStats" class="pi pi-spin pi-spinner stat-spinner" />
        <span v-else class="stat-value">{{ stat.valor }}</span>
        <span class="stat-label">{{ stat.rotulo }}</span>
      </div>
    </div>

    <!-- Seção: Cards de destaque com foto -->
    <section class="section">
      <div class="section-header">
        <i class="pi pi-compass section-icon" />
        <span class="section-title">Explore por categoria</span>
      </div>

      <div class="showcase-grid">
        <div
          v-for="card in cardsExplorar"
          :key="card.titulo"
          class="showcase-card"
          @click="irParaBuscaFiltrada(card.tipoFiltro)"
        >
          <div class="showcase-bg">
            <img
              v-if="card.urlImagem"
              :src="card.urlImagem"
              alt=""
              class="showcase-img"
              loading="lazy"
            />
            <div v-else class="showcase-placeholder" :class="card.classeCor" />
          </div>
          <div class="showcase-overlay" :class="card.classeCor" />
          <div class="showcase-content">
            <div class="showcase-icon-badge" :class="card.classeCor">
              <i :class="`pi ${card.icone}`" />
            </div>
            <div class="showcase-text">
              <span class="showcase-title">{{ card.titulo }}</span>
              <span class="showcase-count" v-if="card.contagem !== null">{{ card.contagem }} vias</span>
              <span class="showcase-count" v-else><i class="pi pi-spin pi-spinner" /></span>
            </div>
            <i class="pi pi-arrow-right showcase-arrow" />
          </div>
        </div>
      </div>
    </section>

    <!-- Seção: Ações rápidas -->
    <section class="section">
      <div class="section-header">
        <i class="pi pi-bolt section-icon" />
        <span class="section-title">Ações rápidas</span>
      </div>

      <div class="actions-grid">
        <div class="action-card" @click="router.push({ name: 'busca' })">
          <div class="action-icon-wrap action-todas">
            <i class="pi pi-list" />
          </div>
          <span class="action-label">Todas as Vias</span>
          <span class="action-meta" v-if="totalVias">{{ totalVias }}</span>
        </div>

        <div class="action-card" @click="router.push({ name: 'explorar' })">
          <div class="action-icon-wrap action-explorar">
            <i class="pi pi-th-large" />
          </div>
          <span class="action-label">Explorar</span>
          <span class="action-meta-desc">Categorias</span>
        </div>

        <div class="action-card" @click="irParaViaAleatoria">
          <div class="action-icon-wrap action-surpresa">
            <i class="pi pi-question" />
          </div>
          <span class="action-label">Aleatória</span>
          <span class="action-meta-desc">Descubra</span>
        </div>

        <div class="action-card" @click="irParaBuscaFiltrada({ campoOrdenacao: 'created_at', direcaoOrdenacao: 'DESC' })">
          <div class="action-icon-wrap action-ultimas">
            <i class="pi pi-clock" />
          </div>
          <span class="action-label">Recentes</span>
          <span class="action-meta-desc">Últimas</span>
        </div>
      </div>
    </section>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HomeService from 'src/services/HomeService';
import ViaService from 'src/services/ViaService';

defineOptions({ name: 'HomePage' });

const router = useRouter();

// Estado reativo
const carregandoStats = ref(true);
const totalVias = ref(0);
const totalMontanhas = ref(0);
const totalEscaladores = ref(0);

// Interface e dados dos cards de categoria
interface CardExplorar {
  titulo: string;
  tipoFiltro: string;
  icone: string;
  classeCor: string;
  contagem: number | null;
  urlImagem: string | null;
}

const cardsExplorar = ref<CardExplorar[]>([
  { titulo: 'Vias em Copacabana', tipoFiltro: 'bairro=copacabana', icone: 'pi-sun', classeCor: 'theme-laranja', contagem: null, urlImagem: null },
  { titulo: 'Terceiro Grau', tipoFiltro: 'grau=3', icone: 'pi-chart-bar', classeCor: 'theme-amarelo', contagem: null, urlImagem: null },
  { titulo: 'Exposição até E2', tipoFiltro: 'exposicao=E2', icone: 'pi-shield', classeCor: 'theme-verde', contagem: null, urlImagem: null },
  { titulo: 'Duração Rápida', tipoFiltro: 'duracao=d1', icone: 'pi-stopwatch', classeCor: 'theme-verde-escuro', contagem: null, urlImagem: null },
  { titulo: 'Vias na Urca', tipoFiltro: 'bairro=urca', icone: 'pi-map-marker', classeCor: 'theme-vermelho', contagem: null, urlImagem: null },
  { titulo: 'Clássicas CERJ', tipoFiltro: 'via_cerj=true', icone: 'pi-trophy', classeCor: 'theme-amarelo', contagem: null, urlImagem: null },
]);

// Dados das estatísticas
const dadosEstatisticas = computed(() => [
  { icone: 'pi-map-marker', valor: totalVias.value, rotulo: 'Vias' },
  { icone: 'pi-map', valor: totalMontanhas.value, rotulo: 'Montanhas' },
  { icone: 'pi-users', valor: totalEscaladores.value, rotulo: 'Escaladores' },
]);

// Cache de imagens (7 dias)
const CHAVE_CACHE = 'home_card_images';
const DIAS_CACHE = 7;

interface CacheImagem {
  timestamp: number;
  imagens: Record<string, string | null>;
}

function lerCacheImagens(): Record<string, string | null> | null {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE);
    if (!bruto) return null;

    const cache: CacheImagem = JSON.parse(bruto);
    const idadeMs = Date.now() - cache.timestamp;
    const limiteMs = DIAS_CACHE * 24 * 60 * 60 * 1000;

    if (idadeMs > limiteMs) return null;
    return cache.imagens;
  } catch {
    return null;
  }
}

function salvarCacheImagens(imagens: Record<string, string | null>) {
  const cache: CacheImagem = { timestamp: Date.now(), imagens };
  localStorage.setItem(CHAVE_CACHE, JSON.stringify(cache));
}

// Carregamento de dados
onMounted(async () => {
  const promessasContagem = cardsExplorar.value.map(c => HomeService.obterContagem(c.tipoFiltro));

  const imagensCache = lerCacheImagens();
  const precisaBuscar = !imagensCache;

  const promessasImagem = precisaBuscar
    ? cardsExplorar.value.map(c => HomeService.obterImagemPorFiltro(c.tipoFiltro))
    : [];

  const [resultadoStats, ...respostas] = await Promise.all([
    HomeService.obterEstatisticas(),
    ...promessasContagem,
    ...promessasImagem,
  ]);

  totalVias.value = resultadoStats.vias;
  totalMontanhas.value = resultadoStats.montanhas;
  totalEscaladores.value = resultadoStats.usuarios;
  carregandoStats.value = false;

  const qtdCards = cardsExplorar.value.length;

  if (precisaBuscar) {
    const novasImagens: Record<string, string | null> = {};
    cardsExplorar.value.forEach((card, idx) => {
      card.contagem = respostas[idx] as number;
      card.urlImagem = respostas[qtdCards + idx] as string | null;
      novasImagens[card.tipoFiltro] = card.urlImagem;
    });
    salvarCacheImagens(novasImagens);
  } else {
    cardsExplorar.value.forEach((card, idx) => {
      card.contagem = respostas[idx] as number;
      card.urlImagem = imagensCache[card.tipoFiltro] ?? null;
    });
  }
});

// Navegação
function irParaBuscaFiltrada(tipoFiltro: string | { campoOrdenacao: string; direcaoOrdenacao: string }) {
  if (typeof tipoFiltro === 'object') {
    router.push({ name: 'busca', query: { sortField: tipoFiltro.campoOrdenacao, sortOrder: tipoFiltro.direcaoOrdenacao } });
  } else {
    router.push({ name: 'busca', query: { filterType: tipoFiltro } });
  }
}

async function irParaViaAleatoria() {
  try {
    const via = await ViaService.getRandomVia();
    router.push({ name: 'ViaDetalhada', params: { id: via.id.toString() } });
  } catch {
    // silently fail
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  @media (max-width: 768px) { padding: 0 16px; }
}

// ================================
// HERO
// ================================
.home-hero {
  text-align: center;
  padding: 48px 0 20px;
  @media (max-width: 768px) { padding: 32px 0 16px; }
}

.hero-icon {
  font-size: 56px;
  color: $cumes-04;
  margin-bottom: 16px;
  display: block;
  filter: drop-shadow(0 2px 8px rgba($cumes-04, 0.3));
  @media (max-width: 768px) { font-size: 44px; }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: $cumes-01;
  margin: 0 0 10px;
  line-height: 1.15;
  letter-spacing: -0.03em;

  .highlight {
    color: $cumes-04;
  }
}

.hero-subtitle {
  font-size: 15px;
  color: rgba($offwhite, 0.5);
  font-weight: 500;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
}

// ================================
// STATS ROW
// ================================
.stats-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 0 8px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba($offwhite, 0.05);
  border: 1.5px solid rgba($offwhite, 0.08);
}

.stat-icon {
  font-size: 18px;
  color: $cumes-03;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: $cumes-01;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba($offwhite, 0.45);
}

.stat-spinner {
  font-size: 16px;
  color: $cumes-03;
}

// ================================
// SECTIONS
// ================================
.section {
  padding: 28px 0;
  border-top: 1px solid rgba($offwhite, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.section-icon {
  font-size: 20px;
  color: $cumes-03;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: $offwhite;
  letter-spacing: -0.01em;
}

// ================================
// SHOWCASE CARDS (com foto de fundo)
// ================================
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.showcase-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px $box-shadow-dark;

    .showcase-img {
      transform: scale(1.08);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
}

.showcase-bg {
  position: absolute;
  inset: 0;
}

.showcase-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.showcase-placeholder {
  width: 100%;
  height: 100%;

  &.theme-laranja { background: linear-gradient(135deg, rgba($cumes-03, 0.3), rgba($cumes-03, 0.1)); }
  &.theme-amarelo { background: linear-gradient(135deg, rgba($cumes-04, 0.3), rgba($cumes-04, 0.1)); }
  &.theme-verde { background: linear-gradient(135deg, rgba($cumes-01, 0.3), rgba($cumes-01, 0.1)); }
  &.theme-verde-escuro { background: linear-gradient(135deg, rgba($cumes-02, 0.3), rgba($cumes-02, 0.1)); }
  &.theme-vermelho { background: linear-gradient(135deg, rgba($cumes-05, 0.3), rgba($cumes-05, 0.1)); }
}

.showcase-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;

  &.theme-laranja { background: linear-gradient(to top, rgba(darken($cumes-03, 25%), 0.92) 0%, rgba(darken($cumes-03, 20%), 0.4) 50%, transparent 100%); }
  &.theme-amarelo { background: linear-gradient(to top, rgba(darken($cumes-04, 45%), 0.92) 0%, rgba(darken($cumes-04, 30%), 0.4) 50%, transparent 100%); }
  &.theme-verde { background: linear-gradient(to top, rgba(darken($cumes-01, 25%), 0.92) 0%, rgba(darken($cumes-01, 20%), 0.4) 50%, transparent 100%); }
  &.theme-verde-escuro { background: linear-gradient(to top, rgba(darken($cumes-02, 15%), 0.92) 0%, rgba(darken($cumes-02, 10%), 0.4) 50%, transparent 100%); }
  &.theme-vermelho { background: linear-gradient(to top, rgba(darken($cumes-05, 25%), 0.92) 0%, rgba(darken($cumes-05, 20%), 0.4) 50%, transparent 100%); }
}

.showcase-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  gap: 12px;
}

.showcase-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i { font-size: 18px; }

  &.theme-laranja { background: rgba($cumes-03, 0.3); i { color: $cumes-03; } }
  &.theme-amarelo { background: rgba($cumes-04, 0.3); i { color: $cumes-04; } }
  &.theme-verde { background: rgba($cumes-01, 0.3); i { color: $cumes-01; } }
  &.theme-verde-escuro { background: rgba($cumes-02, 0.3); i { color: lighten($cumes-02, 20%); } }
  &.theme-vermelho { background: rgba($cumes-05, 0.3); i { color: $cumes-05; } }
}

.showcase-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.showcase-title {
  font-size: 15px;
  font-weight: 700;
  color: $offwhite;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.showcase-count {
  font-size: 12px;
  font-weight: 600;
  color: rgba($offwhite, 0.65);
  .pi-spinner { font-size: 11px; }
}

.showcase-arrow {
  color: rgba($offwhite, 0.5);
  font-size: 14px;
  flex-shrink: 0;
  align-self: flex-end;
}

// ================================
// AÇÕES RÁPIDAS (compacto)
// ================================
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 580px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 16px;
  cursor: pointer;
  background: rgba($offwhite, 0.04);
  border: 1.5px solid rgba($offwhite, 0.08);
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    background: rgba($offwhite, 0.08);
    border-color: rgba($offwhite, 0.15);
    box-shadow: 0 6px 20px $box-shadow-medium;
  }
}

.action-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;

  i { font-size: 22px; }

  .action-card:hover & {
    transform: scale(1.1);
  }

  &.action-todas {
    background: rgba($cumes-01, 0.2);
    i { color: $cumes-01; }
  }
  &.action-explorar {
    background: rgba($cumes-03, 0.2);
    i { color: $cumes-03; }
  }
  &.action-surpresa {
    background: rgba($cumes-04, 0.2);
    i { color: $cumes-04; }
  }
  &.action-ultimas {
    background: rgba($cumes-05, 0.2);
    i { color: $cumes-05; }
  }
}

.action-label {
  font-size: 14px;
  font-weight: 700;
  color: $offwhite;
}

.action-meta {
  font-size: 12px;
  font-weight: 700;
  color: $cumes-01;
}

.action-meta-desc {
  font-size: 11px;
  font-weight: 600;
  color: rgba($offwhite, 0.4);
}

// ================================
// SPACER
// ================================
.page-bottom-spacer {
  height: 60px;
  @media (max-width: 768px) { height: 40px; }
}
</style>
