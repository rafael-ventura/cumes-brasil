<template>
  <q-page class="colecao-detalhe-page">
    <div v-if="colecao">
      <!-- Header estilo Spotify -->
      <div class="colecao-header">
        <BotaoVoltar class="colecao-header__voltar" />

        <!-- Thumbnail + metadados alinhados pela base -->
        <div class="colecao-header__corpo">
          <div
            class="colecao-thumb"
            role="button"
            tabindex="0"
            aria-label="Alterar capa da coleção"
            @click="isConfigDialogOpen = true"
            @keydown.enter.prevent="isConfigDialogOpen = true"
          >
            <q-img
              v-if="urlCapaDetalhe"
              :src="urlCapaDetalhe"
              fit="cover"
              class="colecao-thumb__img"
            />
            <div v-else class="colecao-thumb__placeholder">
              <i class="pi pi-image colecao-thumb__placeholder-icon" aria-hidden="true" />
            </div>
          </div>

          <div class="colecao-meta">
            <span class="colecao-meta__label">Coleção</span>
            <h1 class="colecao-meta__titulo">{{ colecao.nome }}</h1>
            <p v-if="colecao.descricao" class="colecao-meta__descricao">{{ colecao.descricao }}</p>
            <p class="colecao-meta__contagem">
              {{ colecao.viaColecoes?.length || 0 }} via{{ (colecao.viaColecoes?.length || 0) !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <!-- Linha de ações separada (abaixo do header) -->
        <div class="colecao-acoes">
          <template v-if="!modoSelecao">
            <button class="colecao-acoes__btn-primario" @click="openAddViaModal">
              <i class="pi pi-plus" />
              Adicionar via
            </button>
            <button class="colecao-acoes__btn-ghost" @click="modoSelecao = true">
              <i class="pi pi-check-square" />
              Selecionar vias
            </button>
          </template>
          <button v-else class="colecao-acoes__btn-ghost colecao-acoes__btn-ghost--ativo" @click="cancelarSelecao">
            <i class="pi pi-times" />
            Cancelar seleção
          </button>

          <div class="colecao-acoes__secundarias">
            <button class="colecao-acoes__btn-icone" aria-label="Editar coleção" @click="isConfigDialogOpen = true">
              <i class="pi pi-pencil" />
            </button>
            <button v-if="colecao?.id" class="colecao-acoes__btn-icone" aria-label="Compartilhar" @click.stop="abrirModalCompartilhamento">
              <i class="pi pi-share-alt" />
            </button>
          </div>
        </div>
      </div>

      <Busca
        ref="searchEntityRef"
        entity="via"
        layout-compact
        :static-filters="{ colecaoId: colecao?.id }"
        :modo-selecao-vias="modoSelecao"
        :vias-selecionadas-ids="viasSelecionadasIds"
        :ocultar-total-resultados="true"
        @select="goToViaDetalhada"
        :hide-header="true"
        @toggle-selecao-via="aoToggleSelecaoVia"
        @atualizar-results="aoAtualizarResultadosVias"
      >
        <template #filters="{ filters: filtros }">
          <BuscaFiltros
            compact
            :filters="filtros"
            :enabled-filters="['unifiedSearch', 'selectedDifficulty']"
            @applyFilters="applyFilters"
            :static-filters="{ colecaoId: colecao?.id }"
            unified-search-label="Nome da Via"
            entity="via"
          />

          <!-- Barra de seleção (wireframe) - logo abaixo da busca -->
          <div v-if="modoSelecao" class="barra-selecao">
            <button
              class="barra-selecao__btn"
              @click="alternarSelecaoTodasNaPagina"
              :disabled="!viasIdsNaPagina.length"
            >
              <q-checkbox
                :model-value="todasSelecionadasNaPagina"
                dense
                color="cumes-03"
                @update:model-value="alternarSelecaoTodasNaPagina"
              />
              <span class="barra-selecao__texto">
                {{ todasSelecionadasNaPagina ? 'Desmarcar todos' : 'Selecionar todos' }}
              </span>
            </button>

            <div class="barra-selecao__right">
              <Button
                class="barra-selecao__btn-remover"
                icon="pi pi-trash"
                severity="danger"
                :disabled="viasSelecionadasIds.length === 0"
                :loading="removendoLote"
                label="Remover"
                @click="dialogRemoverLoteAberto = true"
              />
            </div>
          </div>
        </template>
      </Busca>

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
        @edit="aoEditarColecao"
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

      <ModalCompartilhamento
        v-model="isModalCompartilhamentoAberto"
        :dados-compartilhamento="dadosCompartilhamento"
      />

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
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import { Notify } from 'quasar';
import ImagemService from 'src/services/ImagemService';
import { ehColecaoFavoritos } from 'src/utils/colecaoUtils';
import { obterUrlCompartilhavel } from 'src/utils/share';
import Button from 'primevue/button';
import ModalCompartilhamento from 'components/Compartilhamento/ModalCompartilhamento.vue';

const route = useRoute();
const router = useRouter();
const searchEntityRef = ref();
const colecao = ref<IColecao | null | undefined>(null);
const isAddViaModalOpen = ref(false);
const isConfigDialogOpen = ref(false);
const isModalCompartilhamentoAberto = ref(false);
const modoSelecao = ref(false);
const viasSelecionadasIds = ref<number[]>([]);
const dialogRemoverLoteAberto = ref(false);
const removendoLote = ref(false);
const viasResultadoAtual = ref<Via[]>([]);

const viasIdsNaPagina = computed(() =>
  viasResultadoAtual.value.map((v) => v.id).filter((id): id is number => id != null)
);

const shareUrl = computed(() => {
  const id = colecao.value?.id;
  if (!id) return '';
  return obterUrlCompartilhavel(`/colecoes/${id}`);
});

const dadosCompartilhamento = computed(() => {
  const id = colecao.value?.id;
  if (!id) return null;
  return {
    titulo: colecao.value?.nome || 'Coleção no Cumes Brasil',
    texto: 'Veja a coleção no Cumes Brasil.',
    url: shareUrl.value
  };
});

function abrirModalCompartilhamento () {
  if (!dadosCompartilhamento.value?.url) return;
  isModalCompartilhamentoAberto.value = true;
}

const temSelecaoNaPagina = computed(() =>
  viasResultadoAtual.value.some((v) => viasSelecionadasIds.value.includes(v.id))
);

const todasSelecionadasNaPagina = computed(() => {
  const ids = viasIdsNaPagina.value;
  if (!ids.length) return false;
  return ids.every((id) => viasSelecionadasIds.value.includes(id));
});
const salvandoMetadados = ref(false);
const enviandoCapa = ref(false);
const removendoCapa = ref(false);
const excluindoColecao = ref(false);

const urlCapaDetalhe = computed(() => {
  const u = colecao.value?.imagemCapa?.url || colecao.value?.imagem?.url;
  return u ? ImagemService.obterUrlCompleta(u) : '';
});

onMounted(async () => {
  const colecaoId = Number(route.params.id);
  colecao.value = await ColecaoService.buscarColecaoPorId(colecaoId);
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.aoAplicarFiltros) {
    searchEntityRef.value.aoAplicarFiltros(filters);
  } else {
    console.error('Busca ref not found or aoAplicarFiltros not defined');
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
  searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
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

function alternarSelecaoTodasNaPagina () {
  if (todasSelecionadasNaPagina.value) limparSelecaoPagina();
  else selecionarTodasNaPagina();
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
    searchEntityRef.value?.aoAplicarFiltros({ page: 1 });
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

const aoEditarColecao = async (dados: { nome: string; descricao: string }) => {
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

  .lista-toolbar--colecoes {
    margin-top: 18px;
  }
}

/* ── Header estilo Spotify ───────────────────────────── */
.colecao-header {
  padding: 16px 0 0;
  margin-bottom: 12px;
}

.colecao-header__voltar {
  margin-bottom: 20px;
}

/* Thumbnail + meta alinhados pela base */
.colecao-header__corpo {
  display: flex;
  align-items: flex-end;
  gap: 24px;

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: 16px;
  }
}

/* Thumbnail */
.colecao-thumb {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.15s, opacity 0.15s;

  &:hover { opacity: 0.88; }

  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
}

.colecao-thumb__img {
  width: 100%;
  height: 100%;
}

.colecao-thumb__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba($cumes-02, 0.6) 0%, rgba($background, 0.95) 100%);
}

.colecao-thumb__placeholder-icon {
  font-size: 40px;
  color: rgba($offwhite, 0.15);
}

/* Metadados */
.colecao-meta {
  flex: 1;
  min-width: 0;
  padding-bottom: 4px;
}

.colecao-meta__label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba($offwhite, 0.5);
  margin-bottom: 6px;
}

.colecao-meta__titulo {
  margin: 0 0 8px;
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  color: $offwhite;
  letter-spacing: -0.03em;
  line-height: 1.0;
}

.colecao-meta__descricao {
  margin: 0 0 6px;
  font-size: 13px;
  color: rgba($offwhite, 0.5);
  line-height: 1.4;
}

.colecao-meta__contagem {
  margin: 0;
  font-size: 13px;
  color: rgba($offwhite, 0.4);
}

/* ── Linha de ações ──────────────────────────────────── */
.colecao-acoes {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0 4px;
  flex-wrap: wrap;
}

.colecao-acoes__secundarias {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.colecao-acoes__btn-icone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: rgba($offwhite, 0.35);
  cursor: pointer;
  font-size: 14px;
  transition: color 0.12s, background 0.12s;

  &:hover {
    color: rgba($offwhite, 0.8);
    background: rgba($offwhite, 0.06);
  }
}

/* Botão primário e ghost — pílula */
.colecao-acoes__btn-primario,
.colecao-acoes__btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 20px;
  padding: 9px 22px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.1s;
  white-space: nowrap;
  font-family: inherit;

  &:active { transform: scale(0.97); }
  i { font-size: 12px; }
}

.colecao-acoes__btn-primario {
  background: $offwhite;
  color: $background;
  border: none;

  &:hover { background: rgba($offwhite, 0.88); }
}

.colecao-acoes__btn-ghost {
  background: transparent;
  color: rgba($offwhite, 0.65);
  border: 1px solid rgba($offwhite, 0.2);

  &:hover {
    border-color: rgba($offwhite, 0.5);
    color: $offwhite;
  }
}

.colecao-acoes__btn-ghost--ativo {
  border-color: rgba($offwhite, 0.4) !important;
  color: $offwhite !important;
  background: rgba($offwhite, 0.06) !important;
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
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
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


/* Alinha header com a barra de busca/ordenação (remove padding extra só nessa página) */
:deep(.busca-root--compacta .slot-container) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.order-container--compacto) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}



/* Barra de seleção (compacta) */
.barra-selecao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba($offwhite, 0.02);
  border: 1px solid rgba($offwhite, 0.07);
  margin: 6px 0 0;
}

.barra-selecao__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: rgba($offwhite, 0.75);
  cursor: pointer;
  padding: 0 2px;
  min-height: 28px;
}

.barra-selecao__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.barra-selecao__texto {
  font-size: 11px;
  font-weight: 700;
}

.barra-selecao__right {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.barra-selecao__contador {
  font-size: 11px;
  font-weight: 800;
  color: $cumes-03;
}

.barra-selecao__btn-remover {
  border-radius: 10px !important;
  box-shadow: none !important;
  font-weight: 800 !important;
  padding: 7px 10px !important;
  font-size: 12px !important;
  height: 34px;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
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
