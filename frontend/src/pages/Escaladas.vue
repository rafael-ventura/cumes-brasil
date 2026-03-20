<template>
  <q-page class="escaladas-page">
    <div class="escaladas-hero">
      <i class="pi pi-bolt escaladas-hero-icon" />
      <h1 class="escaladas-hero-title">Minhas escaladas</h1>
      <p class="escaladas-hero-sub">Registre e revise suas ascensões — selecione várias para excluir de uma vez</p>
    </div>

    <Busca
      ref="searchEntityRef"
      entity="escalada"
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
        <div class="lista-toolbar lista-toolbar--escaladas">
          <div class="lista-toolbar__left">
            <i class="pi pi-list lista-toolbar__icon" />
            <span class="lista-toolbar__title">Suas escaladas</span>
          </div>
          <div class="lista-toolbar__acoes">
            <q-btn
              v-if="!modoSelecao"
              outline
              no-caps
              icon="check_box"
              label="Selecionar escaladas"
              class="lista-toolbar__btn-primario"
              @click="modoSelecao = true"
            />
            <template v-else>
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
            </template>
          </div>
        </div>
      </template>

      <template #filters="{ filters: filtros }">
        <BuscaFiltros
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
import { onMounted, ref, computed } from 'vue';
import SubNavbar from 'src/layouts/SubNavbar.vue';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import type { Escalada } from 'src/models/Escalada';
import AuthenticateService from 'src/services/AuthenticateService';
import EscaladaService from 'src/services/EscaladaService';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

const router = useRouter();
const searchEntityRef = ref();
const modoSelecao = ref(false);
const escaladasSelecionadasIds = ref<number[]>([]);
const escaladasResultadoAtual = ref<Escalada[]>([]);
const dialogExcluirAberto = ref(false);
const excluindoLote = ref(false);

const escaladasIdsNaPagina = computed(() =>
  escaladasResultadoAtual.value.map((e) => e.id).filter((id): id is number => id != null)
);

const temSelecaoNaPagina = computed(() =>
  escaladasResultadoAtual.value.some((e) => escaladasSelecionadasIds.value.includes(e.id))
);

onMounted(async () => {
  await AuthenticateService.redirecionaSeNaoAutenticado(router);
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value?.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  }
};

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
    searchEntityRef.value?.handleApplyFilters({ page: 1 });
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

.escaladas-hero {
  text-align: center;
  padding: 28px 0 8px;

  @media (max-width: 768px) {
    padding: 20px 0 4px;
  }
}

.escaladas-hero-icon {
  font-size: 44px;
  color: $action-escaladas;
  display: block;
  margin: 0 auto 12px;
  filter: drop-shadow(0 2px 8px rgba($action-escaladas, 0.35));
}

.escaladas-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 800;
  color: $cumes-01;
  margin: 0 0 8px;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.escaladas-hero-sub {
  font-size: 14px;
  color: rgba($offwhite, 0.48);
  font-weight: 500;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.45;
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
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
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
