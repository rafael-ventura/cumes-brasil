<template>
  <q-page class="favoritas-page">
    <Busca
      v-if="colecaoId"
      ref="searchEntityRef"
      entity="via"
      layout-compact
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      :staticFilters="{ colecaoId: colecaoId }"
      :hideHeader="true"
      :modo-selecao-vias="modoSelecao"
      :vias-selecionadas-ids="viasSelecionadasIds"
      :ocultar-total-resultados="true"
      @select="goToViaDetalhada"
      @toggle-selecao-via="aoToggleSelecaoVia"
      @atualizar-results="aoAtualizarResultadosVias"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #afterSubHeader>
        <div class="lista-toolbar lista-toolbar--compacto lista-toolbar--favoritas">
          <div class="lista-toolbar__left">
            <i class="pi pi-star lista-toolbar__icon" />
            <span class="lista-toolbar__title">Vias favoritas</span>
          </div>
          <div class="lista-toolbar__acoes">
            <template v-if="!modoSelecao">
              <q-btn
                outline
                no-caps
                icon="add"
                label="Adicionar via"
                class="lista-toolbar__btn-primario"
                @click="openAddViaModal"
              />
              <q-btn
                outline
                no-caps
                icon="check_box"
                label="Selecionar vias"
                class="lista-toolbar__btn-primario"
                @click="modoSelecao = true"
              />
            </template>
            <template v-else>
              <span class="lista-toolbar__chip">{{ viasSelecionadasIds.length }} selecionada(s)</span>
              <q-btn
                flat
                dense
                no-caps
                label="Todas na página"
                class="lista-toolbar__btn-sec"
                :disable="!viasIdsNaPagina.length"
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
                label="Remover dos favoritos"
                :disable="viasSelecionadasIds.length === 0"
                :loading="removendoLote"
                class="btn-toolbar-remover-fav"
                @click="dialogRemoverLoteAberto = true"
              />
            </template>
          </div>
        </div>
      </template>

      <template #filters="{ filters: filtros }">
        <BuscaFiltros
          compact
          :filters="filtros"
          :enabledFilters="['unifiedSearch', 'selectedDifficulty']"
          :staticFilters="{ colecaoId: colecaoId }"
          @applyFilters="aoAplicarFiltros"
          unifiedSearchLabel="Buscar Via"
          :entity="'via'"
        />
      </template>
    </Busca>

    <AddViaModal
      :isOpen="isAddViaModalOpen"
      :colecaoId="colecaoId ?? 0"
      @update:isOpen="isAddViaModalOpen = $event"
      @via-added="viaAdded"
    />

    <q-dialog v-model="dialogRemoverLoteAberto">
      <q-card class="my-card card-confirm-lote-fav">
        <q-card-section class="card-header-fav">
          <div class="card-title-fav">
            <q-icon name="playlist_remove" size="26px" class="title-icon-fav" />
            <span>Remover dos favoritos</span>
          </div>
        </q-card-section>
        <q-card-section class="card-body-fav">
          <p class="texto-confirma-lote-fav">
            {{ viasSelecionadasIds.length }} via(s) sairão dos favoritos. As vias continuam no sistema.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn v-close-popup flat no-caps label="Cancelar" class="btn-cancel-dialog-fav" @click="dialogRemoverLoteAberto = false" />
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="delete"
            label="Remover"
            :loading="removendoLote"
            @click="executarRemoverLote"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import SubNavbar from 'layouts/SubNavbar.vue';
import { Notify } from 'quasar';
import type { Via } from 'src/models/Via';

defineOptions({
  name: 'FavoritasPage'
});

const router = useRouter();
const searchEntityRef = ref();
const colecaoId = ref<number | null>(null);
const isAddViaModalOpen = ref(false);
const modoSelecao = ref(false);
const viasSelecionadasIds = ref<number[]>([]);
const viasResultadoAtual = ref<Via[]>([]);
const dialogRemoverLoteAberto = ref(false);
const removendoLote = ref(false);

const usuarioId = computed(() => window.localStorage.getItem('usuarioId') || null);

const viasIdsNaPagina = computed(() =>
  viasResultadoAtual.value.map((v) => v.id).filter((id): id is number => id != null)
);

const temSelecaoNaPagina = computed(() =>
  viasResultadoAtual.value.some((v) => viasSelecionadasIds.value.includes(v.id))
);

async function fetchFavoritasColecao () {
  if (!usuarioId.value) {
    await router.push('/auth/login');
    return;
  }
  try {
    const colecao = await ColecaoService.obterColecaoFavoritos();
    if (colecao?.id) {
      colecaoId.value = colecao.id;
      await aoAplicarFiltros({ colecaoId: colecao.id });
    } else {
      colecaoId.value = null;
    }
  } catch {
    router.push('/colecoes');
  }
}

onMounted(async () => {
  await fetchFavoritasColecao();
});

const aoAplicarFiltros = (filters: any) => {
  if (searchEntityRef.value?.aoAplicarFiltros) {
    searchEntityRef.value.aoAplicarFiltros(filters);
  }
};

const goToViaDetalhada = (via: any) => {
  router.push(`/vias/${via.id}`);
};

const openAddViaModal = () => {
  isAddViaModalOpen.value = true;
};

const viaAdded = () => {
  searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
};

function aoAtualizarResultadosVias (rows: unknown[]) {
  viasResultadoAtual.value = rows as Via[];
}

function aoToggleSelecaoVia (viaId: number) {
  const arr = [...viasSelecionadasIds.value];
  const i = arr.indexOf(viaId);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(viaId);
  viasSelecionadasIds.value = arr;
}

function selecionarTodasNaPagina () {
  const set = new Set([...viasSelecionadasIds.value, ...viasIdsNaPagina.value]);
  viasSelecionadasIds.value = Array.from(set);
}

function limparSelecaoPagina () {
  const idsPag = new Set(viasIdsNaPagina.value);
  viasSelecionadasIds.value = viasSelecionadasIds.value.filter((id) => !idsPag.has(id));
}

function cancelarSelecao () {
  modoSelecao.value = false;
  viasSelecionadasIds.value = [];
}

async function executarRemoverLote () {
  if (!colecaoId.value || viasSelecionadasIds.value.length === 0) return;
  removendoLote.value = true;
  try {
    await ColecaoService.removerViasEmLote(colecaoId.value, [...viasSelecionadasIds.value]);
    Notify.create({
      type: 'positive',
      message: 'Vias removidas dos favoritos.',
      position: 'top-right',
      timeout: 2800
    });
    dialogRemoverLoteAberto.value = false;
    cancelarSelecao();
    searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Não foi possível remover as vias.',
      position: 'top-right',
      timeout: 3200
    });
  } finally {
    removendoLote.value = false;
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
@import 'src/css/lista-toolbar-acoes.scss';

.favoritas-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 24px;

  @media (min-width: 768px) {
    padding: 0 24px 32px;
  }
}

.btn-toolbar-remover-fav {
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

.card-confirm-lote-fav {
  max-width: 420px !important;
}

.card-header-fav {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 20px 24px;
  border-bottom: 3px solid $action-favoritos;
}

.card-title-fav {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: $offwhite;

  .title-icon-fav {
    color: $action-favoritos;
  }
}

.card-body-fav {
  padding: 20px 24px 8px !important;
}

.texto-confirma-lote-fav {
  margin: 0;
  line-height: 1.5;
  color: rgba($offwhite, 0.88);
  font-size: 15px;
}

.btn-cancel-dialog-fav {
  color: rgba($offwhite, 0.85) !important;
  font-weight: 600 !important;
}
</style>
