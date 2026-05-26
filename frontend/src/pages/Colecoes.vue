<template>
  <q-page class="colecoes-page">
    <div class="colecoes-header-compacto">
      <h1 class="colecoes-header-titulo">Minhas coleções</h1>
      <Button
        class="btn-nova-colecao"
        icon="pi pi-plus"
        label="+ Nova coleção"
        @click="abrirModalAdicao"
      />
    </div>
    <Busca
      ref="searchEntityRef"
      entity="colecao"
      layout-compact
      @select="goToColecaoDetalhada"
      :exibir-menu-colecao="true"
      :enable-sort-options="[{ field: 'nome', label: 'Nome' }, { field: 'updated_at', label: 'Data de Modificação' }]"
      :hide-header="true"
      @editar-colecao="aoEditarColecaoLista"
      @excluir-colecao="aoPedirExcluirColecao"
    >
      <template #subHeader>
        <SubNavbar />
      </template>

      <template #filters="{ filters: filtros }">
        <BuscaFiltros
          compact
          :entity="'colecao'"
          :filters="filtros"
          :enabledFilters="['searchQuery']"
          @applyFilters="aoAplicarFiltros"
          unifiedSearchLabel="Nome da Coleção"
        />
      </template>
    </Busca>

    <AddColecaoModal
      :isOpen="isAddColecaoModalOpen"
      @update:isOpen="isAddColecaoModalOpen = $event"
      @collection-added="addColecao"
    />

    <ModalConfigColecoes
      v-if="colecaoEditando"
      :model-value="modalEditarAberto"
      :collection-data="colecaoEditando"
      :salvando-metadados="salvandoEdicaoLista"
      :enviando-capa="enviandoCapaLista"
      :removendo-capa="removendoCapaLista"
      :excluindo="excluindoColecaoLista"
      @update:model-value="modalEditarAberto = $event"
      @edit="aoSalvarEdicaoLista"
      @capa-enviada="aoCapaLista"
      @remover-capa="aoRemoverCapaLista"
      @excluir-colecao="aoExcluirPeloModalLista"
    />

    <q-dialog v-model="dialogExcluirAberto">
      <q-card class="my-card card-confirm-excluir">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="delete_forever" size="26px" class="title-icon" />
            <span>Excluir coleção?</span>
          </div>
        </q-card-section>
        <q-card-section v-if="colecaoParaExcluir" class="card-body card-body-msg">
          <p class="texto-confirma-excluir">
            Excluir «{{ colecaoParaExcluir.nome }}»? As vias não são apagadas.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn v-close-popup flat no-caps label="Cancelar" class="btn-cancel-dialog" @click="dialogExcluirAberto = false" />
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="delete"
            label="Excluir"
            :loading="excluindoColecaoRapido"
            @click="confirmarExcluirColecaoLista"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <!-- Espaçamento no final da página -->
    <div class="page-bottom-spacer"></div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import ColecaoService from 'src/services/ColecaoService';
import { IColecao } from 'src/models/IColecao';
import Busca from 'components/Busca/Busca.vue';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import SubNavbar from 'layouts/SubNavbar.vue';
import AddColecaoModal from 'components/Colecao/AddColecaoModal.vue';
import ModalConfigColecoes from 'components/Colecao/ModalConfigColecoes.vue';
import { Notify } from 'quasar';
import { ehColecaoFavoritos } from 'src/utils/colecaoUtils';
import Button from 'primevue/button';

const searchEntityRef = ref();
const router = useRouter();
const colecoes = ref<IColecao[] | undefined>([]);
const isAddColecaoModalOpen = ref(false);
const colecaoEditando = ref<IColecao | null>(null);
const modalEditarAberto = ref(false);
const salvandoEdicaoLista = ref(false);
const enviandoCapaLista = ref(false);
const removendoCapaLista = ref(false);
const excluindoColecaoLista = ref(false);
const colecaoParaExcluir = ref<IColecao | null>(null);
const dialogExcluirAberto = ref(false);
const excluindoColecaoRapido = ref(false);

// Agora garantimos que o evento do botão realmente abre o modal
const abrirModalAdicao = () => {
  isAddColecaoModalOpen.value = true;
};

const addColecao = async (colecaoPreenchida: IColecao) => {
  try {
    await ColecaoService.criarColecao(colecaoPreenchida);
    colecoes.value = await ColecaoService.listarColecoesPorUsuario();
    isAddColecaoModalOpen.value = false;
    aoAplicarFiltros({ page: 1 });
  } catch (error) {
    console.error('Erro ao adicionar coleção:', error);
  }
};

defineOptions({
  name: 'ColecoesPage'
});

onMounted(async () => {
  await AuthenticateService.redirecionaSeNaoAutenticado(router);
});

const aoAplicarFiltros = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.aoAplicarFiltros) {
    searchEntityRef.value.aoAplicarFiltros(filters);
  } else {
    console.error('Busca ref not found or aoAplicarFiltros not defined');
  }
};

const goToColecaoDetalhada = (colecao: IColecao) => {
  router.push(`/colecoes/${colecao.id}`);
};

async function aoEditarColecaoLista (c: IColecao) {
  const fresca = await ColecaoService.buscarColecaoPorId(c.id);
  colecaoEditando.value = fresca || c;
  modalEditarAberto.value = true;
}

function aoPedirExcluirColecao (c: IColecao) {
  if (ehColecaoFavoritos(c)) {
    Notify.create({
      type: 'warning',
      message: 'A coleção Favoritas não pode ser excluída.',
      position: 'top-right',
      timeout: 3200
    });
    return;
  }
  colecaoParaExcluir.value = c;
  dialogExcluirAberto.value = true;
}

async function confirmarExcluirColecaoLista () {
  if (!colecaoParaExcluir.value) return;
  excluindoColecaoRapido.value = true;
  try {
    await ColecaoService.excluirColecao(colecaoParaExcluir.value.id);
    Notify.create({ type: 'positive', message: 'Coleção excluída.', position: 'top-right', timeout: 2200 });
    dialogExcluirAberto.value = false;
    colecaoParaExcluir.value = null;
    aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({ type: 'negative', message: 'Não foi possível excluir.', position: 'top-right', timeout: 3200 });
  } finally {
    excluindoColecaoRapido.value = false;
  }
}

async function aoSalvarEdicaoLista (dados: { nome: string; descricao: string }) {
  if (!colecaoEditando.value) return;
  salvandoEdicaoLista.value = true;
  try {
    await ColecaoService.atualizarColecao(colecaoEditando.value.id, dados);
    colecaoEditando.value = { ...colecaoEditando.value, ...dados };
    Notify.create({ type: 'positive', message: 'Coleção atualizada.', position: 'top-right', timeout: 2600 });
    modalEditarAberto.value = false;
    aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao salvar.', position: 'top-right', timeout: 3200 });
  } finally {
    salvandoEdicaoLista.value = false;
  }
}

async function aoCapaLista (arquivo: File) {
  if (!colecaoEditando.value) return;
  enviandoCapaLista.value = true;
  try {
    const atualizada = await ColecaoService.enviarCapaColecao(colecaoEditando.value.id, arquivo);
    if (atualizada) colecaoEditando.value = { ...colecaoEditando.value, ...atualizada };
    Notify.create({ type: 'positive', message: 'Capa atualizada.', position: 'top-right', timeout: 2200 });
    aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({ type: 'negative', message: 'Falha ao enviar capa.', position: 'top-right', timeout: 3200 });
  } finally {
    enviandoCapaLista.value = false;
  }
}

async function aoRemoverCapaLista () {
  if (!colecaoEditando.value) return;
  removendoCapaLista.value = true;
  try {
    const atualizada = await ColecaoService.excluirCapaColecao(colecaoEditando.value.id);
    if (atualizada) colecaoEditando.value = { ...colecaoEditando.value, ...atualizada };
    Notify.create({ type: 'positive', message: 'Capa personalizada removida.', position: 'top-right', timeout: 2200 });
    aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({ type: 'negative', message: 'Não foi possível remover a capa.', position: 'top-right', timeout: 3200 });
  } finally {
    removendoCapaLista.value = false;
  }
}

async function aoExcluirPeloModalLista () {
  if (!colecaoEditando.value) return;
  if (ehColecaoFavoritos(colecaoEditando.value)) {
    Notify.create({
      type: 'warning',
      message: 'A coleção Favoritas não pode ser excluída.',
      position: 'top-right',
      timeout: 3200
    });
    return;
  }
  excluindoColecaoLista.value = true;
  try {
    await ColecaoService.excluirColecao(colecaoEditando.value.id);
    Notify.create({ type: 'positive', message: 'Coleção excluída.', position: 'top-right', timeout: 2200 });
    modalEditarAberto.value = false;
    colecaoEditando.value = null;
    aoAplicarFiltros({ page: 1 });
  } catch {
    Notify.create({ type: 'negative', message: 'Não foi possível excluir.', position: 'top-right', timeout: 3200 });
  } finally {
    excluindoColecaoLista.value = false;
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.colecoes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 24px;

  @media (min-width: 768px) {
    padding: 0 24px 32px;
  }
}

.colecoes-header-compacto {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 0 8px;

  @media (max-width: 768px) {
    padding: 14px 0 6px;
  }
}

.colecoes-header-titulo {
  font-size: 18px;
  font-weight: 700;
  color: $offwhite;
  margin: 0;
  letter-spacing: -0.01em;
}

.btn-nova-colecao {
  background: $cumes-03 !important;
  border: 1px solid rgba($cumes-03, 0.9) !important;
  color: $offwhite !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  padding: 10px 14px !important;

  :deep(.p-button-icon) {
    font-size: 14px;
  }

  &:hover {
    background: rgba($cumes-03, 0.88) !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.page-bottom-spacer {
  height: 48px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 32px;
  }
}

/* Confirmação — alinhado aos outros modais (my-card) */
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

.card-confirm-excluir {
  max-width: 420px !important;
}

.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 22px 26px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 21px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

.card-body-msg {
  padding: 20px 26px 8px !important;
}

.texto-confirma-excluir {
  margin: 0;
  line-height: 1.5;
  color: rgba($offwhite, 0.88);
  font-size: 15px;
}

.btn-cancel-dialog {
  color: rgba($offwhite, 0.85) !important;
  font-weight: 600 !important;
}
</style>
