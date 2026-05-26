<template>
  <q-page class="home-page">
    <section class="home-hero">
      <div class="hero-gradiente" />
      <div class="hero-conteudo">
        <h1 class="hero-title">
          Explore as Montanhas
          <span class="highlight">do Brasil</span>
        </h1>
        <p class="hero-subtitle">
          Descubra vias, registre suas escaladas e conecte-se com a comunidade de montanhismo.
        </p>
        <q-input
          v-model="termoBuscaHome"
          class="hero-busca"
          outlined
          dense
          rounded
          debounce="250"
          placeholder="Buscar montanhas, vias, escaladores..."
          @keydown.enter.prevent="irParaBuscaComTermo"
        >
          <template #prepend>
            <i class="pi pi-search" />
          </template>
          <template #append>
            <q-btn flat round dense icon="east" @click="irParaBuscaComTermo" />
          </template>
        </q-input>
      </div>
    </section>

    <div class="stats-row">
      <router-link
        v-for="stat in dadosEstatisticas"
        :key="stat.rotulo"
        :to="stat.destino"
        class="stat-chip stat-chip--clicavel"
      >
        <i :class="`pi ${stat.icone}`" class="stat-icon" />
        <span v-if="carregandoStats" class="pi pi-spin pi-spinner stat-spinner" />
        <span v-else class="stat-value">{{ stat.valor }}</span>
        <span class="stat-label">{{ stat.rotulo }}</span>
      </router-link>
    </div>

    <section class="home-conteudo-grid">
      <div class="coluna-principal">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-users section-icon" />
            Últimas escaladas
          </h2>
          <button type="button" class="section-acao-link" @click="router.push('/escaladas')">
            Ver todas
            <i class="pi pi-angle-right" />
          </button>
        </div>

        <div v-if="!estaLogado" class="feed-vazio">
          <i class="pi pi-lock" />
          <span>Faça login para ver o feed de escaladas</span>
        </div>
        <div v-else-if="carregandoFeed" class="feed-loading">
          <i class="pi pi-spin pi-spinner" />
          <span>Carregando...</span>
        </div>
        <div v-else-if="feedItems.length === 0" class="feed-vazio">
          <i class="pi pi-inbox" />
          <span>Nenhuma escalada registrada ainda</span>
        </div>
        <div v-else class="feed-lista" @scroll.passive="aoRolarFeed">
          <FeedEscaladaPost
            v-for="item in feedItems"
            :key="item.id"
            :escalada="item"
          />
          <div v-if="carregandoMaisFeed" class="feed-carregando-automatico">
            <i class="pi pi-spin pi-spinner" />
            <span>Carregando mais escaladas...</span>
          </div>
        </div>
      </div>

      <div class="coluna-secundaria">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-compass section-icon" />
            Categorias
          </h2>
        </div>
        <div class="categorias-grid">
          <button
            v-for="card in cardsExplorar"
            :key="card.titulo"
            type="button"
            class="categoria-card"
            :class="card.classeCor"
            @click="irParaBuscaFiltrada(card.tipoFiltro)"
          >
            <div class="categoria-icone">
              <i :class="`pi ${card.icone}`" />
            </div>
            <div class="categoria-textos">
              <span class="categoria-titulo">{{ card.titulo }}</span>
              <span class="categoria-subtitulo" v-if="card.contagem !== null">{{ card.contagem }} vias</span>
              <span class="categoria-subtitulo" v-else><i class="pi pi-spin pi-spinner" /></span>
            </div>
            <i class="pi pi-angle-right categoria-seta" />
          </button>
        </div>

        <div class="section-header section-header-acoes">
          <h2 class="section-title">
            <i class="pi pi-bolt section-icon" />
            Ações rápidas
          </h2>
        </div>
        <div class="acoes-rapidas-grid">
          <button type="button" class="acao-rapida-card acao-primaria" @click="router.push('/escaladas')">
            <div class="acao-rapida-icone"><i class="pi pi-plus" /></div>
            <span class="acao-rapida-label">Nova Escalada</span>
          </button>
          <button type="button" class="acao-rapida-card" @click="router.push('/colecoes')">
            <div class="acao-rapida-icone"><i class="pi pi-bookmark" /></div>
            <span class="acao-rapida-label">Criar Coleção</span>
          </button>
          <button type="button" class="acao-rapida-card" @click="router.push({ name: 'busca' })">
            <div class="acao-rapida-icone"><i class="pi pi-list" /></div>
            <span class="acao-rapida-label">Todas as Vias</span>
          </button>
          <button type="button" class="acao-rapida-card" @click="router.push({ name: 'explorar' })">
            <div class="acao-rapida-icone"><i class="pi pi-th-large" /></div>
            <span class="acao-rapida-label">Explorar</span>
          </button>
          <button type="button" class="acao-rapida-card" @click="irParaViaAleatoria">
            <div class="acao-rapida-icone"><i class="pi pi-question" /></div>
            <span class="acao-rapida-label">Aleatória</span>
          </button>
          <button type="button" class="acao-rapida-card" @click="irParaBuscaFiltrada({ campoOrdenacao: 'created_at', direcaoOrdenacao: 'DESC' })">
            <div class="acao-rapida-icone"><i class="pi pi-clock" /></div>
            <span class="acao-rapida-label">Recentes</span>
          </button>
        </div>
      </div>
    </section>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import HomeService from 'src/services/HomeService';
import ViaService from 'src/services/ViaService';
import EscaladaService from 'src/services/EscaladaService';
import AuthenticateService from 'src/services/AuthenticateService';
import FeedEscaladaPost from 'src/components/Home/FeedEscaladaPost.vue';

defineOptions({ name: 'HomePage' });

const router = useRouter();

// Estado reativo
const carregandoStats = ref(true);
const feedItems = ref<any[]>([]);
const feedPagina = ref(1);
const feedTotalPages = ref(1);
const carregandoFeed = ref(false);
const carregandoMaisFeed = ref(false);
const termoBuscaHome = ref('');

const ITENS_POR_PAGINA = 10;

const estaLogado = computed(() => AuthenticateService.isTokenValid());
const temMaisFeed = computed(() => feedPagina.value < feedTotalPages.value);
const totalVias = ref(0);
const totalMontanhas = ref(0);
const totalCroquis = ref(0);
const totalEscaladores = ref(0);

interface StatHome {
  icone: string;
  valor: number;
  rotulo: string;
  destino: RouteLocationRaw;
}

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
  { titulo: 'Duração D1', tipoFiltro: 'duracao=d1', icone: 'pi-stopwatch', classeCor: 'theme-verde-escuro', contagem: null, urlImagem: null },
  { titulo: 'Vias na Urca', tipoFiltro: 'bairro=urca', icone: 'pi-map-marker', classeCor: 'theme-vermelho', contagem: null, urlImagem: null },
  { titulo: 'Clássicas CERJ', tipoFiltro: 'via_cerj=true', icone: 'pi-trophy', classeCor: 'theme-amarelo', contagem: null, urlImagem: null },
]);

const dadosEstatisticas = computed((): StatHome[] => [
  { icone: 'pi-map-marker', valor: totalVias.value, rotulo: 'Vias', destino: { name: 'explorar' } },
  { icone: 'pi-map', valor: totalMontanhas.value, rotulo: 'Montanhas', destino: { name: 'explorar' } },
  {
    icone: 'pi-images',
    valor: totalCroquis.value,
    rotulo: 'Croquis',
    destino: { name: 'busca', query: { filterType: 'com_croqui=true' } }
  },
  { icone: 'pi-users', valor: totalEscaladores.value, rotulo: 'Escaladores', destino: { path: '/escaladas' } }
]);

// Cache de imagens (7 dias) — v3: invalida cache com nulls de fetch anterior com bug
const CHAVE_CACHE = 'home_card_images_v3';
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
  totalCroquis.value = resultadoStats.croquis ?? 0;
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

  if (estaLogado.value) {
    carregarFeed();
  }
});

async function carregarFeed() {
  feedPagina.value = 1;
  carregandoFeed.value = true;
  try {
    const result = await EscaladaService.obterFeed(1, ITENS_POR_PAGINA);
    feedItems.value = result.items;

    feedTotalPages.value = result.totalPages;
  } catch {
    feedItems.value = [];
  } finally {
    carregandoFeed.value = false;
  }
}

async function carregarMaisFeed() {
  if (carregandoFeed.value || carregandoMaisFeed.value || !temMaisFeed.value) return;
  carregandoMaisFeed.value = true;
  try {
    const proximaPagina = feedPagina.value + 1;
    const result = await EscaladaService.obterFeed(proximaPagina, ITENS_POR_PAGINA);
    feedItems.value = [...feedItems.value, ...result.items];
    feedPagina.value = proximaPagina;
  } finally {
    carregandoMaisFeed.value = false;
  }
}

function aoRolarFeed(evento: Event) {
  if (!temMaisFeed.value || carregandoMaisFeed.value || carregandoFeed.value) return;
  const elemento = evento.target as HTMLElement | null;
  if (!elemento) return;

  const distanciaDoFim = elemento.scrollHeight - elemento.scrollTop - elemento.clientHeight;
  if (distanciaDoFim <= 140) {
    carregarMaisFeed();
  }
}

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

function irParaBuscaComTermo() {
  const termoBusca = termoBuscaHome.value?.trim();
  router.push({
    name: 'busca',
    query: termoBusca ? { search: termoBusca } : {}
  });
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.home-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 20px 0;
}

.home-hero {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba($offwhite, 0.1);
  background: rgba($offwhite, 0.03);
  padding: 34px 28px;
}

.hero-gradiente {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba($cumes-01, 0.16), rgba($cumes-03, 0.06) 45%, transparent 100%);
  pointer-events: none;
}

.hero-conteudo {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.08;
  margin: 0;
  font-weight: 800;
  color: $offwhite;

  .highlight {
    display: block;
    color: $cumes-01;
  }
}

.hero-subtitle {
  margin: 12px 0 0;
  max-width: 540px;
  color: rgba($offwhite, 0.65);
  font-size: 15px;
  line-height: 1.45;
}

.hero-busca {
  margin-top: 16px;
  max-width: 520px;

  :deep(.q-field__control) {
    background: rgba($offwhite, 0.06) !important;
    border-radius: 12px !important;

    &::before {
      border-color: rgba($offwhite, 0.16) !important;
    }
  }

  :deep(.q-field__native) {
    color: $offwhite !important;
    font-size: 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($offwhite, 0.4) !important;
  }

  :deep(.q-field__prepend),
  :deep(.q-field__append) {
    color: rgba($offwhite, 0.45) !important;
  }
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba($offwhite, 0.03);
  border: 1px solid rgba($offwhite, 0.08);
}

.stat-chip--clicavel {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($cumes-01, 0.38);
    background: rgba($cumes-01, 0.09);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);

    .stat-icon {
      color: $cumes-01;
      transform: scale(1.1);
    }

    .stat-value {
      color: $offwhite;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid rgba($cumes-01, 0.65);
    outline-offset: 2px;
  }
}

.stat-icon {
  font-size: 15px;
  color: $cumes-04;
  flex-shrink: 0;
  transition: color 0.22s ease, transform 0.22s ease;
}

.stat-value {
  font-size: 21px;
  font-weight: 800;
  color: $offwhite;
  transition: color 0.22s ease;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: rgba($offwhite, 0.45);
}

.stat-spinner {
  font-size: 14px;
  color: $cumes-01;
}

.home-conteudo-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.58fr) minmax(0, 1fr);
  gap: 14px;
}

.coluna-principal,
.coluna-secundaria {
  min-width: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  font-weight: 700;
  color: rgba($offwhite, 0.8);
}

.section-icon {
  color: $cumes-01;
  font-size: 14px;
}

.section-acao-link {
  border: none;
  background: transparent;
  color: rgba($offwhite, 0.45);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $offwhite;
  }
}

.feed-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 390px;
  max-height: 610px;
  overflow-y: auto;
  padding-right: 4px;
}

.feed-carregando-automatico {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed rgba($cumes-01, 0.35);
  border-radius: 10px;
  background: rgba($cumes-01, 0.05);
  color: rgba($cumes-01, 0.95);
  font-size: 12px;
  font-weight: 700;
  padding: 10px;
}

.feed-loading,
.feed-vazio {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba($offwhite, 0.08);
  border-radius: 14px;
  color: rgba($offwhite, 0.5);
}

.feed-carregar-mais {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border: 1px dashed rgba($cumes-01, 0.45);
  border-radius: 10px;
  background: transparent;
  color: $cumes-01;
  font-size: 13px;
  font-weight: 700;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: rgba($cumes-01, 0.08);
  }
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.categoria-card {
  border: 1px solid rgba($offwhite, 0.1);
  background: rgba($offwhite, 0.03);
  border-radius: 14px;
  padding: 12px 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($cumes-01, 0.35);
    background: rgba($offwhite, 0.05);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  }
}

.categoria-icone {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($offwhite, 0.08);
  flex-shrink: 0;

  i {
    font-size: 14px;
    color: $cumes-01;
  }
}

.categoria-textos {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.categoria-titulo {
  font-size: 12px;
  color: $offwhite;
  font-weight: 700;
  line-height: 1.25;
}

.categoria-subtitulo {
  font-size: 10px;
  color: rgba($offwhite, 0.48);
  font-weight: 600;
}

.categoria-seta {
  margin-left: auto;
  color: rgba($offwhite, 0.35);
  font-size: 12px;
}

.section-header-acoes {
  margin-top: 14px;
}

.acoes-rapidas-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.acao-rapida-card {
  aspect-ratio: 1 / 1;
  border: 1px solid rgba($offwhite, 0.1);
  background: rgba($offwhite, 0.03);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($cumes-01, 0.38);
    background: rgba($offwhite, 0.08);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
  }
}

.acao-rapida-icone {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba($cumes-01, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 15px;
    color: $cumes-01;
  }
}

.acao-rapida-label {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: rgba($offwhite, 0.85);
  line-height: 1.2;
}

.acao-primaria {
  background: rgba($cumes-01, 0.18);
  border-color: rgba($cumes-01, 0.35);

  .acao-rapida-icone {
    background: rgba($background, 0.25);

    i {
      color: $offwhite;
    }
  }

  .acao-rapida-label {
    color: $offwhite;
  }
}

.page-bottom-spacer {
  height: 60px;
}

@media (max-width: 1024px) {
  .home-conteudo-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 14px 14px 0;
  }

  .home-hero {
    padding: 24px 16px;
  }

  .hero-title {
    font-size: 31px;
  }

  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .stat-chip {
    padding: 10px 10px;
  }

  .stat-value {
    font-size: 18px;
  }

  .categorias-grid {
    grid-template-columns: 1fr 1fr;
  }

  .feed-lista {
    min-height: 320px;
    max-height: 500px;
  }
}
</style>
