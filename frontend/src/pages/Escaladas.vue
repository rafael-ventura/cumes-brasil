<template>
  <q-page class="escaladas-page">
    <Busca
      :key="`busca-escaladas-${filtroAtivo}`"
      ref="searchEntityRef"
      entity="escalada"
      layout-compact
      layout-variant="escaladas"
      :staticFilters="filtrosBuscaEscaladas"
      @atualizar-results="aoAtualizarResultadosEscaladas"
      :hideHeader="true"
      :enableSortOptions="[{ field: 'data', label: 'Data' }]"
      :modo-selecao-escaladas="modoSelecao"
      :escaladas-selecionadas-ids="escaladasSelecionadasIds"
      @toggle-selecao-escalada="aoToggleSelecaoEscalada"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #afterSubHeader>
        <div class="escaladas-controles-cabecalho">
          <div class="filtros-perfil-wrap filtros-perfil-wrap--com-acao">
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtroAtivo === 'todas' }"
              @click="aoAlterarFiltro('todas')"
            >
              <i class="pi pi-th-large filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Todas</span>
              <span class="filtro-pill__count">{{ totalTodas }}</span>
            </button>
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtroAtivo === 'autor' }"
              @click="aoAlterarFiltro('autor')"
            >
              <i class="pi pi-pencil filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Por mim</span>
              <span class="filtro-pill__count">{{ totalAutor }}</span>
            </button>
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtroAtivo === 'marcado' }"
              @click="aoAlterarFiltro('marcado')"
            >
              <i class="pi pi-user-plus filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Me marcaram</span>
              <span class="filtro-pill__count">{{ totalMarcado }}</span>
            </button>
          </div>
          <div class="escaladas-controles-cabecalho__acoes">
            <q-btn
              v-if="!modoSelecao"
              round
              dense
              outline
              icon="check_box"
              class="escaladas-btn-selecionar"
              aria-label="Selecionar escaladas"
              @click="modoSelecao = true"
            >
              <q-tooltip anchor="bottom middle" self="top middle">Selecionar escaladas</q-tooltip>
            </q-btn>
            <div v-else class="escaladas-controles-cabecalho__acoes-modo-selecao">
              <span class="lista-toolbar__chip">{{ escaladasSelecionadasIds.length }} selecionada(s)</span>
              <q-btn
                flat
                dense
                no-caps
                label="Todas na página"
                class="lista-toolbar__btn-sec"
                :disable="!escaladasIdsNaPagina.length"
                @click="selecionarTodasNaPagina"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Limpar página"
                class="lista-toolbar__btn-sec"
                :disable="!temSelecaoNaPagina"
                @click="limparSelecaoPagina"
              />
              <q-btn
                flat
                no-caps
                label="Cancelar"
                class="lista-toolbar__btn-sec"
                @click="cancelarSelecao"
              />
              <q-btn
                unelevated
                no-caps
                color="negative"
                outline
                icon="delete_outline"
                label="Excluir selecionadas"
                :disable="escaladasSelecionadasIds.length === 0"
                :loading="excluindoLote"
                class="btn-toolbar-remover-esc"
                @click="dialogExcluirAberto = true"
              />
            </div>
          </div>
        </div>
      </template>

      <template #filters="{ filters: filtros }">
        <BuscaFiltros
          compact
          :entity="'escalada'"
          :filters="filtros"
          :enabledFilters="['searchQuery']"
          @applyFilters="applyFilters"
          unifiedSearchLabel="Buscar Escalada"
        />
      </template>
    </Busca>

    <q-dialog v-model="dialogExcluirAberto">
      <q-card class="my-card card-confirm-esc">
        <q-card-section class="card-header-esc">
          <div class="card-title-esc">
            <q-icon name="delete_forever" size="26px" class="title-icon-esc" />
            <span>Excluir escaladas</span>
          </div>
        </q-card-section>
        <q-card-section class="card-body-esc">
          <p class="texto-confirma-esc">
            Excluir {{ escaladasSelecionadasIds.length }} registro(s) de escalada? Esta ação não pode ser desfeita.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn v-close-popup flat no-caps label="Cancelar" class="btn-cancel-dialog-esc" @click="dialogExcluirAberto = false" />
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="delete"
            label="Excluir"
            :loading="excluindoLote"
            @click="executarExcluirLote"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import SubNavbar from 'src/layouts/SubNavbar.vue';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import type { Escalada } from 'src/models/Escalada';
import AuthenticateService from 'src/services/AuthenticateService';
import EscaladaService from 'src/services/EscaladaService';
import { useRouter, useRoute } from 'vue-router';
import { Notify } from 'quasar';
import type { BuscaRequest } from 'src/models/BuscaRequest';

const router = useRouter();
const route = useRoute();
const searchEntityRef = ref();
const modoSelecao = ref(false);
const escaladasSelecionadasIds = ref<number[]>([]);
const escaladasResultadoAtual = ref<Escalada[]>([]);
const dialogExcluirAberto = ref(false);
const excluindoLote = ref(false);
type FiltroEscaladas = 'todas' | 'autor' | 'marcado';
const filtroAtivo = ref<FiltroEscaladas>('autor');
const totalAutor = ref(0);
const totalMarcado = ref(0);
const totalTodas = ref(0);

function normalizarFiltro(valor: unknown): FiltroEscaladas {
  const v = String(valor || '').toLowerCase().trim();
  if (v === 'todas' || v === 'marcado' || v === 'autor') return v;
  return 'autor';
}

const filtrosBuscaEscaladas = computed<Partial<BuscaRequest>>(() => ({
  comoPerfil: filtroAtivo.value
}));

const escaladasIdsNaPagina = computed(() =>
  escaladasResultadoAtual.value.map((e) => e.id).filter((id): id is number => id != null)
);

const temSelecaoNaPagina = computed(() =>
  escaladasResultadoAtual.value.some((e) => escaladasSelecionadasIds.value.includes(e.id))
);

onMounted(async () => {
  await AuthenticateService.redirecionaSeNaoAutenticado(router);
  filtroAtivo.value = normalizarFiltro(route.query.filtro);
  await carregarContagens();
});

watch(
  () => route.query.filtro,
  (novo) => {
    filtroAtivo.value = normalizarFiltro(novo);
  }
);

const applyFilters = (filters: any) => {
  if (searchEntityRef.value?.aoAplicarFiltros) {
    searchEntityRef.value.aoAplicarFiltros(filters);
  }
};

async function carregarContagens() {
  const usuarioId = Number(localStorage.getItem('usuarioId') || 0);
  if (!usuarioId) {
    totalAutor.value = 0;
    totalMarcado.value = 0;
    totalTodas.value = 0;
    return;
  }

  const [autorLista, marcadoLista] = await Promise.all([
    EscaladaService.listarPorUsuarioId(usuarioId, 'autor'),
    EscaladaService.listarOndeFoiMarcado(usuarioId)
  ]);

  totalAutor.value = (autorLista ?? []).length;
  totalMarcado.value = (marcadoLista ?? []).length;
  const ids = new Set([...(autorLista ?? []).map((e) => e.id), ...(marcadoLista ?? []).map((e) => e.id)]);
  totalTodas.value = ids.size;
}

function aoAlterarFiltro(novoFiltro: FiltroEscaladas) {
  if (filtroAtivo.value === novoFiltro) return;
  filtroAtivo.value = novoFiltro;
  router.replace({ path: '/escaladas', query: { ...route.query, filtro: novoFiltro } });
}

function aoAtualizarResultadosEscaladas (rows: unknown[]) {
  escaladasResultadoAtual.value = rows as Escalada[];
}

function aoToggleSelecaoEscalada (id: number) {
  const arr = [...escaladasSelecionadasIds.value];
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(id);
  escaladasSelecionadasIds.value = arr;
}

function selecionarTodasNaPagina () {
  const set = new Set([...escaladasSelecionadasIds.value, ...escaladasIdsNaPagina.value]);
  escaladasSelecionadasIds.value = Array.from(set);
}

function limparSelecaoPagina () {
  const idsPag = new Set(escaladasIdsNaPagina.value);
  escaladasSelecionadasIds.value = escaladasSelecionadasIds.value.filter((id) => !idsPag.has(id));
}

function cancelarSelecao () {
  modoSelecao.value = false;
  escaladasSelecionadasIds.value = [];
}

async function executarExcluirLote () {
  if (escaladasSelecionadasIds.value.length === 0) return;
  excluindoLote.value = true;
  const ids = [...escaladasSelecionadasIds.value];
  try {
    await Promise.all(ids.map((id) => EscaladaService.excluirPorId(id)));
    Notify.create({
      type: 'positive',
      message: ids.length > 1 ? 'Escaladas excluídas.' : 'Escalada excluída.',
      position: 'top-right',
      timeout: 2800
    });
    dialogExcluirAberto.value = false;
    cancelarSelecao();
    searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Não foi possível excluir todas. Tente novamente.',
      position: 'top-right',
      timeout: 3200
    });
  } finally {
    excluindoLote.value = false;
  }
}

defineOptions({
  name: 'EscaladasPage'
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
@import 'src/css/lista-toolbar-acoes.scss';

.escaladas-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 24px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;

  @media (min-width: 768px) {
    padding: 0 24px 32px;
  }
}

.escaladas-controles-cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 12px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.filtros-perfil-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 auto 8px;
  max-width: 760px;
  width: 100%;
}

.filtros-perfil-wrap--com-acao {
  flex: 1 1 min(760px, 100%);
  margin: 0;
  max-width: none;
}

.escaladas-controles-cabecalho__acoes {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.escaladas-controles-cabecalho__acoes-modo-selecao {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  max-width: min(100vw - 32px, 720px);
}

.escaladas-btn-selecionar {
  border-color: rgba($cumes-01, 0.65) !important;
  color: $cumes-01 !important;
}

.filtro-pill {
  appearance: none;
  border: 1px solid rgba($offwhite, 0.14);
  background: rgba($offwhite, 0.02);
  border-radius: 12px;
  color: rgba($offwhite, 0.86);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.filtro-pill.ativo {
  color: $offwhite;
}

.filtro-pill:nth-child(1).ativo {
  border-color: rgba($cumes-03, 0.75);
  background: rgba($cumes-03, 0.14);
}

.filtro-pill:nth-child(2).ativo {
  border-color: rgba($cumes-01, 0.78);
  background: rgba($cumes-01, 0.14);
}

.filtro-pill:nth-child(3).ativo {
  border-color: rgba($action-escaladas, 0.8);
  background: rgba($action-escaladas, 0.14);
}

.filtro-pill__icone {
  font-size: 14px;
  opacity: 0.85;
}

.filtro-pill__titulo {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.filtro-pill__count {
  font-size: 12px;
  font-weight: 800;
  color: rgba($offwhite, 0.82);
}

.btn-toolbar-remover-esc {
  font-weight: 700 !important;
  border-radius: 10px !important;
}

.page-bottom-spacer {
  height: 48px;
  width: 100%;
}

.my-card {
  min-width: 300px;
  max-width: 440px;
  width: 92vw;
  border-radius: 16px;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
}

.card-confirm-esc {
  max-width: 420px !important;
}

.card-header-esc {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 20px 24px;
  border-bottom: 3px solid $action-escaladas;
}

.card-title-esc {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: $offwhite;

  .title-icon-esc {
    color: $action-escaladas;
  }
}

.card-body-esc {
  padding: 20px 24px 8px !important;
}

.texto-confirma-esc {
  margin: 0;
  line-height: 1.5;
  color: rgba($offwhite, 0.88);
  font-size: 15px;
}

.btn-cancel-dialog-esc {
  color: rgba($offwhite, 0.85) !important;
  font-weight: 600 !important;
}
</style>
