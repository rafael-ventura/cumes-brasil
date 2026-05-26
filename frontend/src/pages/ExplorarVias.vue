<template>
  <q-page class="explorar-page">
    <!-- Hero compacto -->
    <div class="explorar-hero">
      <i class="pi pi-compass hero-icon" />
      <h1 class="hero-title">Explorar</h1>
      <p class="hero-subtitle">Categorias, localização, dificuldade, modalidade e croquis</p>
    </div>

    <!-- Search bar -->
    <div class="search-section">
      <SearchBar
        v-model="textoBusca"
        label="Buscar via por nome, local ou montanha..."
        @search="irParaBusca"
      />
    </div>

    <!-- Categorias principais -->
    <section class="section">
      <div class="section-header">
        <i class="pi pi-th-large section-icon" />
        <span class="section-title">Categorias</span>
      </div>
      <div class="categories-grid">
        <!-- Todas as Vias -->
        <div class="category-card card-todas" @click="navegarPara('/busca')">
          <div class="card-icon-area">
            <i class="pi pi-list card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Todas as Vias</span>
            <span class="card-count" v-if="estatisticas.vias">{{ estatisticas.vias }} vias</span>
            <span class="card-count" v-else><i class="pi pi-spin pi-spinner" /></span>
          </div>
          <i class="pi pi-arrow-right card-arrow" />
        </div>

        <!-- Por Localização -->
        <div class="category-card card-localizacao" @click="rolarParaSecao('localizacao')">
          <div class="card-icon-area">
            <i class="pi pi-map-marker card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Por Localização</span>
            <span class="card-desc">Navegue por país, estado, cidade</span>
          </div>
          <i class="pi pi-arrow-down card-arrow" />
        </div>

        <!-- Por Dificuldade -->
        <div class="category-card card-dificuldade" @click="rolarParaSecao('dificuldade')">
          <div class="card-icon-area">
            <i class="pi pi-chart-bar card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Por Dificuldade</span>
            <span class="card-desc">Escolha seu nível de desafio</span>
          </div>
          <i class="pi pi-arrow-down card-arrow" />
        </div>

        <!-- Clássicas CERJ -->
        <div class="category-card card-cerj" @click="navegarPara('/busca', { filterType: 'via_cerj=true' })">
          <div class="card-icon-area">
            <i class="pi pi-trophy card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Clássicas CERJ</span>
            <span class="card-count" v-if="contagemCerj !== null">{{ contagemCerj }} vias</span>
            <span class="card-count" v-else><i class="pi pi-spin pi-spinner" /></span>
          </div>
          <i class="pi pi-arrow-right card-arrow" />
        </div>

        <!-- Por Modalidade -->
        <div class="category-card card-modalidade" @click="rolarParaSecao('modalidade')">
          <div class="card-icon-area">
            <i class="pi pi-tag card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Por Modalidade</span>
            <span class="card-desc">Tradicional, Esportiva, Boulder...</span>
          </div>
          <i class="pi pi-arrow-down card-arrow" />
        </div>

        <!-- Vias com Croqui -->
        <div class="category-card card-croqui" @click="navegarPara('/busca', { filterType: 'com_croqui=true' })">
          <div class="card-icon-area">
            <i class="pi pi-images card-main-icon" />
          </div>
          <div class="card-text">
            <span class="card-title">Vias com Croqui</span>
            <span class="card-count" v-if="contagemComCroqui !== null">{{ contagemComCroqui }} vias</span>
            <span class="card-count" v-else><i class="pi pi-spin pi-spinner" /></span>
          </div>
          <i class="pi pi-arrow-right card-arrow" />
        </div>
      </div>
    </section>

    <!-- Seção: Por Dificuldade -->
    <section class="section" ref="dificuldadeRef">
      <div class="section-header">
        <i class="pi pi-chart-bar section-icon" />
        <span class="section-title">Por Dificuldade</span>
      </div>
      <div class="grade-grid">
        <div
          v-for="grau in cardsGrau"
          :key="grau.rotulo"
          class="grade-card"
          :style="{ '--grade-color': grau.cor }"
          @click="navegarPara('/busca', { filterType: `grau=${grau.valor}` })"
        >
          <span class="grade-label">{{ grau.rotulo }}</span>
          <span class="grade-count" v-if="grau.contagem !== null">{{ grau.contagem }} vias</span>
          <span class="grade-count" v-else><i class="pi pi-spin pi-spinner" /></span>
        </div>

        <div
          class="grade-card grade-card-special"
          :style="{ '--grade-color': '#888' }"
          @click="navegarPara('/busca', { filterType: 'sem_grau=true' })"
        >
          <span class="grade-label"><i class="pi pi-question-circle" /></span>
          <span class="grade-sublabel">Sem grau</span>
          <span class="grade-count" v-if="contagemSemGrau !== null">{{ contagemSemGrau }} vias</span>
          <span class="grade-count" v-else><i class="pi pi-spin pi-spinner" /></span>
        </div>
      </div>
    </section>

    <!-- Seção: Por Localização -->
    <section class="section" ref="localizacaoRef">
      <div class="section-header">
        <i class="pi pi-map-marker section-icon" />
        <span class="section-title">Por Localização</span>
      </div>
      <LocationExplorer
        :hierarchy="hierarquia"
        :loading="carregandoHierarquia"
        @location-change="aoMudarLocalizacao"
        @select-montanha="aoSelecionarMontanha"
      />
      <div v-if="temFiltroLocalizacao" class="location-action">
        <button class="btn-ver-vias" @click="irParaBuscaComLocalizacao">
          <i class="pi pi-search" />
          <span>Ver vias nesta região</span>
          <i class="pi pi-arrow-right" />
        </button>
      </div>
      <div class="sem-localizacao-card" @click="navegarPara('/busca', { filterType: 'sem_localizacao=true' })">
        <i class="pi pi-map" />
        <span>Sem localização definida</span>
        <span class="sem-loc-count" v-if="contagemSemLocalizacao !== null">{{ contagemSemLocalizacao }} vias</span>
        <span class="sem-loc-count" v-else><i class="pi pi-spin pi-spinner" /></span>
        <i class="pi pi-arrow-right" />
      </div>
    </section>

    <!-- Seção: Por Modalidade -->
    <section class="section" ref="modalidadeRef">
      <div class="section-header">
        <i class="pi pi-tag section-icon" />
        <span class="section-title">Por Modalidade</span>
      </div>
      <div class="modalidade-grid">
        <div
          v-for="mod in modalidades"
          :key="mod.valor"
          class="modalidade-card"
          @click="navegarPara('/busca', { filterType: `modalidade=${mod.valor}` })"
        >
          <i :class="`pi ${mod.icone} modalidade-icon`" />
          <span class="modalidade-label">{{ mod.rotulo }}</span>
          <span class="modalidade-count" v-if="mod.contagem !== null">{{ mod.contagem }} vias</span>
          <span class="modalidade-count" v-else><i class="pi pi-spin pi-spinner" /></span>
        </div>
      </div>
    </section>

    <!-- Seção: Por Exposição -->
    <section class="section" ref="exposicaoRef">
      <div class="section-header">
        <i class="pi pi-exclamation-triangle section-icon" />
        <span class="section-title">Por Exposição</span>
      </div>
      <div class="exposure-grid">
        <div
          v-for="exp in cardsExposicao"
          :key="exp.valor"
          class="exposure-card"
          :style="{ '--exp-color': exp.cor }"
          @click="navegarPara('/busca', { filterType: `exposicao=${exp.valor}` })"
        >
          <span class="exposure-level">{{ exp.valor.toUpperCase() }}</span>
          <span class="exposure-count" v-if="exp.contagem !== null">{{ exp.contagem }} vias</span>
          <span class="exposure-count" v-else><i class="pi pi-spin pi-spinner" /></span>
        </div>
      </div>
    </section>

    <!-- Seção: Por Duração (D1–D7) -->
    <section class="section" ref="duracaoRef">
      <div class="section-header">
        <i class="pi pi-clock section-icon" />
        <span class="section-title">Por Duração</span>
      </div>
      <div class="duration-grid">
        <div
          v-for="d in cardsDuracao"
          :key="d.valor"
          class="duration-card"
          :style="{ '--dur-color': d.cor }"
          @click="navegarPara('/busca', { filterType: `duracao=${d.valor}` })"
        >
          <span class="duration-level">{{ d.valor.toUpperCase() }}</span>
          <span v-if="d.contagem !== null" class="duration-count">{{ d.contagem }} vias</span>
          <span v-else class="duration-count"><i class="pi pi-spin pi-spinner" /></span>
        </div>
      </div>
    </section>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from 'components/Busca/SearchBar.vue';
import LocationExplorer from 'components/Explorar/LocationExplorer.vue';
import localizacaoService from 'src/services/LocalizacaoService';
import type { LocationNode } from 'src/services/LocalizacaoService';
import HomeService from 'src/services/HomeService';
import { listaCardsDuracao } from 'src/utils/escalaDuracao';

defineOptions({ name: 'ExplorarViasPage' });

const router = useRouter();
const textoBusca = ref('');

// Estatísticas
const estatisticas = ref({ vias: 0, montanhas: 0, croquis: 0, usuarios: 0 });
const contagemCerj = ref<number | null>(null);
const contagemComCroqui = ref<number | null>(null);

// Localização
const hierarquia = ref<LocationNode[]>([]);
const carregandoHierarquia = ref(true);
const filtrosLocalizacaoAtual = ref<Record<string, number>>({});

const temFiltroLocalizacao = computed(() => Object.keys(filtrosLocalizacaoAtual.value).length > 0);

// Refs para scroll
const dificuldadeRef = ref<HTMLElement | null>(null);
const localizacaoRef = ref<HTMLElement | null>(null);
const modalidadeRef = ref<HTMLElement | null>(null);
const exposicaoRef = ref<HTMLElement | null>(null);
const duracaoRef = ref<HTMLElement | null>(null);

// Cards de grau
const cardsGrau = ref([
  { rotulo: '1°', valor: '1', cor: '#F29340', contagem: null as number | null },
  { rotulo: '2°', valor: '2', cor: '#a4c77d', contagem: null as number | null },
  { rotulo: '3°', valor: '3', cor: '#F4E285', contagem: null as number | null },
  { rotulo: '4°', valor: '4', cor: '#8CB369', contagem: null as number | null },
  { rotulo: '5°', valor: '5', cor: '#e8733a', contagem: null as number | null },
  { rotulo: '6°', valor: '6', cor: '#BC4B51', contagem: null as number | null },
  { rotulo: '7°', valor: '7', cor: '#9b3a3f', contagem: null as number | null },
]);
const contagemSemGrau = ref<number | null>(null);
const contagemSemLocalizacao = ref<number | null>(null);

// Modalidades
const modalidades = ref([
  { valor: 'TRADICIONAL', rotulo: 'Tradicional', icone: 'pi-shield', contagem: null as number | null },
  { valor: 'ESPORTIVA', rotulo: 'Esportiva', icone: 'pi-bolt', contagem: null as number | null },
  { valor: 'BOULDER', rotulo: 'Boulder', icone: 'pi-circle', contagem: null as number | null },
  { valor: 'BIG_WALL', rotulo: 'Big Wall', icone: 'pi-building', contagem: null as number | null },
  { valor: 'ARTIFICIAL', rotulo: 'Artificial', icone: 'pi-wrench', contagem: null as number | null },
  { valor: 'PSICOBLOC', rotulo: 'Psicobloc', icone: 'pi-sun', contagem: null as number | null },
]);

// Exposição (E1–E5): só código na UI; cores alinhadas à gradação de risco
const cardsExposicao = ref([
  { valor: 'e1', cor: '#F29340', contagem: null as number | null },
  { valor: 'e2', cor: '#a4c77d', contagem: null as number | null },
  { valor: 'e3', cor: '#F4E285', contagem: null as number | null },
  { valor: 'e4', cor: '#8CB369', contagem: null as number | null },
  { valor: 'e5', cor: '#BC4B51', contagem: null as number | null },
]);

const cardsDuracao = ref(
  listaCardsDuracao().map((c) => ({ ...c, contagem: null as number | null }))
);

// Navegação
function navegarPara(caminho: string, query?: Record<string, string>) {
  router.push({ path: caminho, query });
}

function irParaBusca(valor: string) {
  if (valor && valor.length >= 2) {
    navegarPara('/busca', { search: valor });
  } else if (!valor) {
    navegarPara('/busca');
  }
}

function rolarParaSecao(secao: string) {
  const mapaRefs: Record<string, typeof dificuldadeRef> = {
    dificuldade: dificuldadeRef,
    localizacao: localizacaoRef,
    modalidade: modalidadeRef,
    exposicao: exposicaoRef,
    duracao: duracaoRef,
  };
  const elemento = mapaRefs[secao]?.value;
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function aoMudarLocalizacao(filtros: Record<string, number>) {
  filtrosLocalizacaoAtual.value = { ...filtros };
}

function aoSelecionarMontanha(id: number) {
  navegarPara('/busca', { filterType: `montanha=${id}` });
}

function irParaBuscaComLocalizacao() {
  const f = filtrosLocalizacaoAtual.value;
  if (f.bairroId) navegarPara('/busca', { filterType: `bairroId=${f.bairroId}` });
  else if (f.cidadeId) navegarPara('/busca', { filterType: `cidadeId=${f.cidadeId}` });
  else if (f.estadoId) navegarPara('/busca', { filterType: `estadoId=${f.estadoId}` });
  else if (f.paisId) navegarPara('/busca', { filterType: `paisId=${f.paisId}` });
  else navegarPara('/busca');
}

// Carregamento de dados
onMounted(async () => {
  const [
    resultadoStats,
    resultadoCerj,
    resultadoComCroqui,
    resultadoHierarquia,
    resultadoSemGrau,
    resultadoSemLoc,
    ...contagensGrau
  ] = await Promise.all([
    HomeService.obterEstatisticas(),
    HomeService.obterContagem('via_cerj=true'),
    HomeService.obterContagem('com_croqui=true'),
    localizacaoService.getLocationHierarchy().catch(() => []),
    HomeService.obterContagem('sem_grau'),
    HomeService.obterContagem('sem_localizacao'),
    ...cardsGrau.value.map(g => HomeService.obterContagem(`grau=${g.valor}`))
  ]);

  const contagensDuracao = await Promise.all(
    cardsDuracao.value.map((d) => HomeService.obterContagem(`duracao=${d.valor}`))
  );
  cardsDuracao.value.forEach((c, i) => {
    c.contagem = contagensDuracao[i];
  });

  const contagensModalidade = await Promise.all(
    modalidades.value.map((m) => HomeService.obterContagem(`modalidade=${m.valor}`))
  );
  modalidades.value.forEach((m, i) => {
    m.contagem = contagensModalidade[i];
  });

  const contagensExposicao = await Promise.all(
    cardsExposicao.value.map((e) => HomeService.obterContagem(`exposicao=${e.valor}`))
  );
  cardsExposicao.value.forEach((e, i) => {
    e.contagem = contagensExposicao[i];
  });

  estatisticas.value = resultadoStats;
  contagemCerj.value = resultadoCerj;
  contagemComCroqui.value = resultadoComCroqui;
  hierarquia.value = resultadoHierarquia;
  carregandoHierarquia.value = false;
  contagemSemGrau.value = resultadoSemGrau;
  contagemSemLocalizacao.value = resultadoSemLoc;

  cardsGrau.value.forEach((card, idx) => {
    card.contagem = contagensGrau[idx];
  });
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.explorar-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  @media (max-width: 768px) { padding: 0 16px; }
}

// ================================
// HERO
// ================================
.explorar-hero {
  text-align: center;
  padding: 40px 0 16px;
  @media (max-width: 768px) { padding: 24px 0 12px; }
}

.hero-icon {
  font-size: 48px;
  color: $cumes-04;
  margin-bottom: 12px;
  display: block;
  filter: drop-shadow(0 2px 8px rgba($cumes-04, 0.3));
  @media (max-width: 768px) { font-size: 40px; }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: $cumes-01;
  margin: 0 0 6px;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  font-size: 15px;
  color: rgba($offwhite, 0.5);
  margin: 0;
  font-weight: 500;
}

// ================================
// SEARCH
// ================================
.search-section {
  padding: 12px 0 24px;
  max-width: 640px;
  margin: 0 auto;
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
// CATEGORIAS PRINCIPAIS
// ================================
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1.5px solid transparent;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px $box-shadow-strong;
  }

  &:active { transform: translateY(-1px); }
}

.card-todas {
  background: linear-gradient(135deg, rgba($cumes-01, 0.15), rgba($cumes-01, 0.05));
  border-color: rgba($cumes-01, 0.25);
  .card-icon-area { background: rgba($cumes-01, 0.2); }
  .card-main-icon { color: $cumes-01; }
  &:hover { border-color: $cumes-01; }
}

.card-localizacao {
  background: linear-gradient(135deg, rgba($cumes-03, 0.12), rgba($cumes-03, 0.04));
  border-color: rgba($cumes-03, 0.2);
  .card-icon-area { background: rgba($cumes-03, 0.2); }
  .card-main-icon { color: $cumes-03; }
  &:hover { border-color: $cumes-03; }
}

.card-dificuldade {
  background: linear-gradient(135deg, rgba($cumes-04, 0.12), rgba($cumes-04, 0.04));
  border-color: rgba($cumes-04, 0.2);
  .card-icon-area { background: rgba($cumes-04, 0.2); }
  .card-main-icon { color: $cumes-04; }
  &:hover { border-color: $cumes-04; }
}

.card-cerj {
  background: linear-gradient(135deg, rgba($cumes-04, 0.12), rgba($cumes-04, 0.04));
  border-color: rgba($cumes-04, 0.2);
  .card-icon-area { background: rgba($cumes-04, 0.2); }
  .card-main-icon { color: $cumes-04; }
  &:hover { border-color: $cumes-04; }
}

.card-modalidade {
  background: linear-gradient(135deg, rgba($cumes-05, 0.12), rgba($cumes-05, 0.04));
  border-color: rgba($cumes-05, 0.2);
  .card-icon-area { background: rgba($cumes-05, 0.2); }
  .card-main-icon { color: $cumes-05; }
  &:hover { border-color: $cumes-05; }
}

.card-croqui {
  background: linear-gradient(135deg, rgba($cumes-03, 0.14), rgba($cumes-03, 0.05));
  border-color: rgba($cumes-03, 0.24);
  .card-icon-area { background: rgba($cumes-03, 0.2); }
  .card-main-icon { color: $cumes-03; }
  &:hover { border-color: $cumes-03; }
}

.card-icon-area {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-main-icon {
  font-size: 24px;
}

.card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: $offwhite;
}

.card-desc {
  font-size: 13px;
  color: rgba($offwhite, 0.45);
  font-weight: 500;
}

.card-count {
  font-size: 13px;
  color: rgba($offwhite, 0.55);
  font-weight: 600;

  .pi-spinner {
    font-size: 12px;
  }
}

.card-arrow {
  color: rgba($offwhite, 0.3);
  font-size: 14px;
  flex-shrink: 0;
}

// ================================
// GRADE CARDS
// ================================
.grade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 10px;
  @media (min-width: 1100px) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
}

.grade-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 20px 12px;
  border-radius: 14px;
  cursor: pointer;
  background: color-mix(in srgb, var(--grade-color) 10%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--grade-color) 30%, transparent);
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px $box-shadow-medium;
    border-color: var(--grade-color);
    background: color-mix(in srgb, var(--grade-color) 18%, transparent);
  }
}

.grade-label {
  font-size: 28px;
  font-weight: 800;
  color: var(--grade-color);
  line-height: 1;
}

.grade-sublabel {
  font-size: 12px;
  color: rgba($offwhite, 0.5);
  font-weight: 600;
}

.grade-count {
  font-size: 12px;
  color: rgba($offwhite, 0.4);
  font-weight: 600;
  margin-top: 4px;

  .pi-spinner { font-size: 11px; }
}

.grade-card-special {
  .grade-label {
    font-size: 22px;
  }
}

// ================================
// SEM LOCALIZAÇÃO CARD
// ================================
.sem-localizacao-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 20px;
  border-radius: 12px;
  background: rgba($offwhite, 0.04);
  border: 1.5px solid rgba($offwhite, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba($offwhite, 0.7);
  font-weight: 600;
  font-size: 14px;

  .pi-map { font-size: 18px; opacity: 0.6; }
  .pi-arrow-right { margin-left: auto; opacity: 0.4; font-size: 14px; }

  .sem-loc-count {
    font-size: 12px;
    color: rgba($offwhite, 0.4);
    font-weight: 600;
    .pi-spinner { font-size: 11px; }
  }

  &:hover {
    background: rgba($offwhite, 0.08);
    border-color: rgba($offwhite, 0.2);
  }
}

// ================================
// MODALIDADE CARDS
// ================================
.modalidade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }
}

.modalidade-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 16px;
  border-radius: 14px;
  cursor: pointer;
  background: rgba($offwhite, 0.04);
  border: 1.5px solid rgba($offwhite, 0.1);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba($cumes-01, 0.1);
    border-color: rgba($cumes-01, 0.4);
    box-shadow: 0 6px 20px $box-shadow-medium;

    .modalidade-icon {
      color: $cumes-01;
      transform: scale(1.15);
    }
  }
}

.modalidade-icon {
  font-size: 28px;
  color: rgba($offwhite, 0.6);
  transition: all 0.25s ease;
}

.modalidade-label {
  font-size: 14px;
  font-weight: 700;
  color: $offwhite;
  text-align: center;
}

.modalidade-count {
  font-size: 11px;
  color: rgba($offwhite, 0.4);
  font-weight: 600;
}

// ================================
// EXPOSURE CARDS
// ================================
.exposure-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  @media (max-width: 520px) {
    gap: 8px;
  }
}

.exposure-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  padding: 16px 8px;
  border-radius: 14px;
  cursor: pointer;
  background: color-mix(in srgb, var(--exp-color) 8%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--exp-color) 25%, transparent);
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--exp-color);
    background: color-mix(in srgb, var(--exp-color) 15%, transparent);
    box-shadow: 0 6px 20px $box-shadow-medium;
  }
}

.exposure-level {
  font-size: clamp(18px, 2.8vw, 24px);
  font-weight: 800;
  color: var(--exp-color);
  letter-spacing: 0.02em;
}

.exposure-count {
  font-size: 11px;
  color: rgba($offwhite, 0.4);
  font-weight: 600;
  margin-top: 4px;
  text-align: center;
}

// ================================
// DURAÇÃO (D1–D7)
// ================================
.duration-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  @media (max-width: 900px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
}

.duration-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 88px;
  padding: 14px 8px;
  border-radius: 14px;
  cursor: pointer;
  background: color-mix(in srgb, var(--dur-color) 8%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--dur-color) 25%, transparent);
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--dur-color);
    background: color-mix(in srgb, var(--dur-color) 15%, transparent);
    box-shadow: 0 6px 20px $box-shadow-medium;
  }
}

.duration-level {
  font-size: clamp(16px, 2.2vw, 22px);
  font-weight: 800;
  color: var(--dur-color);
  letter-spacing: 0.02em;
}

.duration-count {
  font-size: 11px;
  color: rgba($offwhite, 0.38);
  font-weight: 600;
  margin-top: auto;
  align-self: center;
  width: 100%;
  text-align: center;

  .pi-spinner {
    font-size: 11px;
  }
}

// ================================
// LOCATION ACTION
// ================================
.location-action {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.btn-ver-vias {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  border: 2px solid $cumes-01;
  border-radius: 12px;
  background: rgba($cumes-01, 0.1);
  color: $cumes-01;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: $cumes-01;
    color: $offwhite;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba($cumes-01, 0.3);
  }

  i { font-size: 14px; }
}

// ================================
// SPACER
// ================================
.page-bottom-spacer {
  height: 60px;
  @media (max-width: 768px) { height: 40px; }
}
</style>
