<template>
  <q-page class="colecao-detalhe-page">
    <div v-if="colecao">
      <div class="header-container">
        <BotaoVoltar class="back-button" />
        <div class="header">
          <div
            class="header-capa-click"
            role="button"
            tabindex="0"
            aria-label="Alterar capa da coleção"
            @click="isConfigDialogOpen = true"
            @keydown.enter.prevent="isConfigDialogOpen = true"
          >
            <div
              v-if="urlCapaDetalhe"
              :style="{ backgroundImage: `url(${urlCapaDetalhe})` }"
              class="header-image"
            />
            <div
              v-else
              class="header-placeholder-wrapper"
            >
              <ImagePlaceholder
                class="header-placeholder"
                :fillColor="'$primary'"
              />
            </div>
            <div class="capa-overlay">
              <i class="pi pi-camera" />
              <span>Alterar capa</span>
            </div>
          </div>
          <div class="header-content">
            <div class="header-info">
              <div class="text-h5">{{ colecao.nome }}</div>
              <q-btn
                round
                flat
                dense
                icon="edit"
                class="btn-edit-header"
                aria-label="Editar coleção"
                @click.stop="isConfigDialogOpen = true"
              />
            </div>
            <div class="text-subtitle1">{{ colecao.descricao }}</div>
            <div class="text-caption">Vias: {{ colecao.viaColecoes?.length || 0 }}</div>
          </div>
        </div>
      </div>

      <div class="lista-toolbar lista-toolbar--colecoes">
        <div class="lista-toolbar__left">
          <i class="pi pi-list lista-toolbar__icon" />
          <span class="lista-toolbar__title">Vias nesta coleção</span>
        </div>
        <div class="lista-toolbar__acoes">
          <q-btn
            v-if="!modoSelecao"
            outline
            no-caps
            icon="check_box"
            label="Selecionar vias"
            class="lista-toolbar__btn-primario"
            @click="modoSelecao = true"
          />
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
              label="Remover da coleção"
              :disable="viasSelecionadasIds.length === 0"
              :loading="removendoLote"
              class="btn-toolbar-remover"
              @click="dialogRemoverLoteAberto = true"
            />
          </template>
        </div>
      </div>

      <Busca
        ref="searchEntityRef"
        entity="via"
        :static-filters="{ colecaoId: colecao?.id }"
        :modo-selecao-vias="modoSelecao"
        :vias-selecionadas-ids="viasSelecionadasIds"
        @select="goToViaDetalhada"
        :hide-header="true"
        @toggle-selecao-via="aoToggleSelecaoVia"
        @atualizar-results="aoAtualizarResultadosVias"
      >
        <template #filters="{ filters: filtros }">
          <BuscaFiltros
            :filters="filtros"
            :enabled-filters="['unifiedSearch', 'selectedDifficulty']"
            @applyFilters="applyFilters"
            :static-filters="{ colecaoId: colecao?.id }"
            unified-search-label="Nome da Via"
            entity="via"
          />
        </template>
      </Busca>

      <BotaoAdicionar @add="openAddViaModal" />

      <AddViaModal
        :is-open="isAddViaModalOpen"
        :colecao-id="colecao!.id"
        @update:is-open="updateIsAddViaModalOpen"
        @via-added="viaAdded"
      />

      <ModalConfigColecoes
        :model-value="isConfigDialogOpen"
        :collection-data="colecao"
        :salvando-metadados="salvandoMetadados"
        :enviando-capa="enviandoCapa"
        :removendo-capa="removendoCapa"
        :excluindo="excluindoColecao"
        @update:model-value="isConfigDialogOpen = $event"
        @edit="handleEditColecao"
        @capa-enviada="handleCapaEnviada"
        @remover-capa="handleRemoverCapa"
        @excluir-colecao="handleExcluirColecao"
      />

      <q-dialog v-model="dialogRemoverLoteAberto">
        <q-card class="my-card card-confirm-lote">
          <q-card-section class="card-header">
            <div class="card-title">
              <q-icon name="playlist_remove" size="26px" class="title-icon" />
              <span>Remover vias</span>
            </div>
          </q-card-section>
          <q-card-section class="card-body card-body-confirm">
            <p class="texto-confirma-lote">
              {{ viasSelecionadasIds.length }} via(s) sairão desta coleção. As vias continuam no sistema.
            </p>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn v-close-popup flat no-caps label="Cancelar" class="btn-fechar-dialog" @click="dialogRemoverLoteAberto = false" />
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Via } from 'src/models/Via';
import { useRoute, useRouter } from 'vue-router';
import ColecaoService from 'src/services/ColecaoService';
import { IColecao } from 'src/models/IColecao';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import AddViaModal from 'components/Colecao/AddViaModal.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import Busca from 'components/Busca/Busca.vue';
import ImagePlaceholder from 'components/ImagePlaceholder.vue';
import BotaoAdicionar from 'components/BotaoAdicionar.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import { Notify } from 'quasar';
import ImagemService from 'src/services/ImagemService';
import { ehColecaoFavoritos } from 'src/utils/colecaoUtils';

const route = useRoute();
const router = useRouter();
const searchEntityRef = ref();
const colecao = ref<IColecao | null | undefined>(null);
const isAddViaModalOpen = ref(false);
const isConfigDialogOpen = ref(false);
const modoSelecao = ref(false);
const viasSelecionadasIds = ref<number[]>([]);
const dialogRemoverLoteAberto = ref(false);
const removendoLote = ref(false);
const viasResultadoAtual = ref<Via[]>([]);

const viasIdsNaPagina = computed(() =>
  viasResultadoAtual.value.map((v) => v.id).filter((id): id is number => id != null)
);

const temSelecaoNaPagina = computed(() =>
  viasResultadoAtual.value.some((v) => viasSelecionadasIds.value.includes(v.id))
);
const salvandoMetadados = ref(false);
const enviandoCapa = ref(false);
const removendoCapa = ref(false);
const excluindoColecao = ref(false);

const urlCapaDetalhe = computed(() => {
  const u = colecao.value?.imagemCapa?.url || colecao.value?.imagem?.url;
  return u ? ImagemService.getFullImageUrl(u) : '';
});

onMounted(async () => {
  const colecaoId = Number(route.params.id);
  colecao.value = await ColecaoService.buscarColecaoPorId(colecaoId);
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('Busca ref not found or handleApplyFilters not defined');
  }
};

const goToViaDetalhada = (id: any) => {
  router.push(`/vias/${id}`);
};

const openAddViaModal = () => {
  isAddViaModalOpen.value = false;
  setTimeout(() => {
    isAddViaModalOpen.value = true;
  }, 50);
};

const updateIsAddViaModalOpen = (value: boolean) => {
  isAddViaModalOpen.value = value;
};

const viaAdded = () => {
  searchEntityRef.value?.handleApplyFilters({ page: 1 });
  recarregarMetadadosColecao();
};

async function recarregarMetadadosColecao () {
  if (!colecao.value?.id) return;
  const atual = await ColecaoService.buscarColecaoPorId(colecao.value.id);
  if (atual) colecao.value = atual;
}

function aoAtualizarResultadosVias (rows: unknown[]) {
  viasResultadoAtual.value = rows as Via[];
}

function selecionarTodasNaPagina () {
  const ids = viasIdsNaPagina.value;
  const set = new Set([...viasSelecionadasIds.value, ...ids]);
  viasSelecionadasIds.value = Array.from(set);
}

function limparSelecaoPagina () {
  const idsPag = new Set(viasIdsNaPagina.value);
  viasSelecionadasIds.value = viasSelecionadasIds.value.filter((id) => !idsPag.has(id));
}

function aoToggleSelecaoVia (viaId: number) {
  const arr = [...viasSelecionadasIds.value];
  const i = arr.indexOf(viaId);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(viaId);
  viasSelecionadasIds.value = arr;
}

function cancelarSelecao () {
  modoSelecao.value = false;
  viasSelecionadasIds.value = [];
}

async function executarRemoverLote () {
  if (!colecao.value || viasSelecionadasIds.value.length === 0) return;
  removendoLote.value = true;
  try {
    await ColecaoService.removerViasEmLote(colecao.value.id, [...viasSelecionadasIds.value]);
    Notify.create({
      type: 'positive',
      message: 'Vias removidas da coleção.',
      position: 'top-right',
      timeout: 2800
    });
    dialogRemoverLoteAberto.value = false;
    cancelarSelecao();
    searchEntityRef.value?.handleApplyFilters({ page: 1 });
    await recarregarMetadadosColecao();
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

const handleEditColecao = async (dados: { nome: string; descricao: string }) => {
  if (!colecao.value) return;
  salvandoMetadados.value = true;
  try {
    await ColecaoService.atualizarColecao(colecao.value.id, dados);
    colecao.value.nome = dados.nome;
    colecao.value.descricao = dados.descricao;
    Notify.create({
      type: 'positive',
      message: 'Coleção atualizada com sucesso!',
      position: 'top-right',
      timeout: 3000
    });
    isConfigDialogOpen.value = false;
  } catch (error) {
    console.error('Erro ao atualizar coleção:', error);
    Notify.create({
      type: 'negative',
      message: 'Erro ao atualizar coleção. Tente novamente.',
      position: 'top-right',
      timeout: 3000
    });
  } finally {
    salvandoMetadados.value = false;
  }
};

async function handleCapaEnviada (arquivo: File) {
  if (!colecao.value) return;
  enviandoCapa.value = true;
  try {
    const atualizada = await ColecaoService.enviarCapaColecao(colecao.value.id, arquivo);
    if (atualizada) {
      Object.assign(colecao.value, atualizada);
    }
    Notify.create({
      type: 'positive',
      message: 'Capa atualizada.',
      position: 'top-right',
      timeout: 2600
    });
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Falha ao enviar a capa.',
      position: 'top-right',
      timeout: 3200
    });
  } finally {
    enviandoCapa.value = false;
  }
}

async function handleRemoverCapa () {
  if (!colecao.value) return;
  removendoCapa.value = true;
  try {
    const atualizada = await ColecaoService.excluirCapaColecao(colecao.value.id);
    if (atualizada) Object.assign(colecao.value, atualizada);
    Notify.create({
      type: 'positive',
      message: 'Capa personalizada removida.',
      position: 'top-right',
      timeout: 2600
    });
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Não foi possível remover a capa.',
      position: 'top-right',
      timeout: 3200
    });
  } finally {
    removendoCapa.value = false;
  }
}

async function handleExcluirColecao () {
  if (!colecao.value) return;
  if (ehColecaoFavoritos(colecao.value)) {
    Notify.create({
      type: 'warning',
      message: 'A coleção Favoritas não pode ser excluída.',
      position: 'top-right',
      timeout: 3200
    });
    return;
  }
  excluindoColecao.value = true;
  try {
    await ColecaoService.excluirColecao(colecao.value.id);
    Notify.create({
      type: 'positive',
      message: 'Coleção excluída.',
      position: 'top-right',
      timeout: 2200
    });
    isConfigDialogOpen.value = false;
    router.push('/colecoes');
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Não foi possível excluir a coleção.',
      position: 'top-right',
      timeout: 3200
    });
  } finally {
    excluindoColecao.value = false;
  }
}
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
@import "src/css/lista-toolbar-acoes.scss";

.colecao-detalhe-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 24px;

  @media (min-width: 768px) {
    padding: 0 24px 32px;
  }
}

.btn-toolbar-remover {
  font-weight: 700 !important;
  border-radius: 10px !important;
}

/* Diálogo de confirmação (mesmo vocabulário de AddColecaoModal) */
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

.card-confirm-lote {
  max-width: 420px !important;
}

.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 20px 24px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

.card-body-confirm {
  padding: 20px 24px 8px !important;
}

.btn-fechar-dialog {
  color: rgba($offwhite, 0.85) !important;
  font-weight: 600 !important;
}

.header-container {
  position: relative;
  width: 100%;
  margin: 0;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.header {
  width: 100%;
  height: 380px;
  background: linear-gradient(160deg, rgba($cumes-01, 0.35) 0%, rgba($cumes-02, 0.5) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.28),
    0 1px 0 rgba($offwhite, 0.06) inset;
  padding-bottom: 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: 375px;
  }
}

.header-capa-click {
  position: absolute;
  inset: 0;
  z-index: 0;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: inset 0 0 0 3px $cumes-03;
  }
}

.capa-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: $offwhite;
  font-size: 15px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;

  .pi {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    opacity: 0.85;
    pointer-events: auto;
  }
}

.header-capa-click:hover .capa-overlay,
.header-capa-click:focus-visible .capa-overlay {
  opacity: 1;
  pointer-events: auto;
}

.header-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.header-placeholder-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100% - 70px);
  z-index: 0;
  overflow: visible;
  pointer-events: none;
}

.header-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba($cumes-01, 0.1);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 5px 20px 0 20px;
  box-sizing: border-box;
  position: relative;

  :deep(.svg-placeholder),
  :deep(svg) {
    max-height: 180px;
    max-width: 200px;
    width: auto;
    height: auto;
    display: block;
    visibility: visible !important;
    opacity: 1 !important;
    margin: 0;
    margin-bottom: -15px !important;
    padding: 0;
    position: relative;
    transform: translateY(-15px);
  }
}

.header-content {
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  min-height: 70px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-edit-header {
  color: $offwhite !important;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.text-subtitle1 {
  font-size: 1rem;
  color: white;
}

.text-caption {
  font-size: 0.875rem;
  color: white;
}

.texto-confirma-lote {
  margin: 0;
  line-height: 1.5;
  color: rgba($offwhite, 0.88);
  font-size: 15px;
}

.page-bottom-spacer {
  height: 48px;
  width: 100%;

  @media (max-width: 768px) {
    height: 150px;
  }
}
</style>
