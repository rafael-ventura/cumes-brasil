<template>
  <div>
    <div class="q-pt-md search-header" v-if="!hideHeader">
      <div class="text-h4 text-orange-4" v-text="searchHeader != null ? searchHeader : 'Busca'" />
    </div>

    <div v-if="$slots.subHeader">
      <slot name="subHeader" />
    </div>

    <div v-if="$slots.afterSubHeader" class="busca-after-subheader">
      <slot name="afterSubHeader" />
    </div>

    <div class="slot-container no-border">
      <slot name="filters" :filters="filtros"/>
    </div>
    <BuscaResultados
      :results="resultados"
      :entityType="props.entity"
      @select="selecionarItem"
      :exibir-menu-colecao="exibirMenuColecao"
      :modo-selecao-vias="modoSelecaoVias"
      :vias-selecionadas-ids="viasSelecionadasIds"
      @editar-colecao="$emit('editar-colecao', $event)"
      @excluir-colecao="$emit('excluir-colecao', $event)"
      @toggle-selecao-via="$emit('toggle-selecao-via', $event)"
      :modo-selecao-escaladas="modoSelecaoEscaladas"
      :escaladas-selecionadas-ids="escaladasSelecionadasIds"
      @toggle-selecao-escalada="$emit('toggle-selecao-escalada', $event)"
      :enableSortOptions="enableSortOptions"
      :initialSort="filtros.campoOrdenacao && filtros.direcaoOrdenacao
        ? { field: filtros.campoOrdenacao, direction: filtros.direcaoOrdenacao === 'DESC' ? 'desc' : 'asc' }
        : undefined"
      @change-sort="atualizarOrdenacao"
      :totalItems="totalItens"
      :totalPages="totalPaginas"
      :currentPage="filtros.pagina"
      :itemsPerPage="filtros.itensPorPagina || 20"
      :loading="carregando"
      :hidePagination="props.hidePagination"
      @page-change="onPageChange"
      @items-per-page-change="onItemsPerPageChange"
    />

    <div class="busca-bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import searchService from 'src/services/SearchService';
import BuscaResultados from 'components/Busca/BuscaResultados.vue';
import { BuscaRequest } from 'src/models/BuscaRequest';
import { useRoute } from 'vue-router';

const props = withDefaults(
  defineProps<{
    entity: 'via' | 'colecao' | 'escalada';
    initialData?: any[];
    staticFilters?: Partial<any>;
    hideHeader?: boolean;
    searchHeader?: string;
    enableSortOptions?: { field: string; label: string }[];
    hidePagination?: boolean;
    /** Lista de coleções: menu ⋮ nos cards (minhas coleções). */
    exibirMenuColecao?: boolean;
    /** Vias dentro da coleção: modo seleção em lote. */
    modoSelecaoVias?: boolean;
    viasSelecionadasIds?: number[];
    modoSelecaoEscaladas?: boolean;
    escaladasSelecionadasIds?: number[];
  }>(),
  {
    exibirMenuColecao: false,
    modoSelecaoVias: false,
    viasSelecionadasIds: () => [],
    modoSelecaoEscaladas: false,
    escaladasSelecionadasIds: () => []
  }
);

defineOptions({ name: 'BuscaComponent' });
const emit = defineEmits([
  'select',
  'atualizar-results',
  'editar-colecao',
  'excluir-colecao',
  'toggle-selecao-via',
  'toggle-selecao-escalada'
]);
const route = useRoute();

// ─── Itens por página salvos no localStorage ────────────────────────

function getItensPorPaginaSalvos(): number {
  const chave = props.entity === 'colecao' ? 'colecoes_items_per_page' : 'vias_items_per_page';
  const valorPadrao = props.entity === 'colecao' ? 9 : 20;
  const opcoes = props.entity === 'colecao' ? [9, 10, 25, 50, 100] : [10, 25, 50, 100];

  const salvo = localStorage.getItem(chave);
  if (salvo) {
    const valor = parseInt(salvo, 10);
    if (opcoes.includes(valor)) return valor;
  }
  return valorPadrao;
}

// ─── Parsear filtros da URL (query string) ──────────────────────────

function parseFiltrosDaQuery(): Partial<BuscaRequest> {
  const resultado: Partial<BuscaRequest> = {};

  const campoOrdenacao = route.query.sortField as string | undefined;
  const direcaoOrdenacao = route.query.sortOrder as string | undefined;
  if (campoOrdenacao && direcaoOrdenacao) {
    resultado.campoOrdenacao = campoOrdenacao;
    resultado.direcaoOrdenacao = direcaoOrdenacao.toUpperCase();
  }

  const termoBusca = route.query.search as string | undefined;
  if (termoBusca) {
    resultado.termoBusca = termoBusca;
  }

  const filterType = route.query.filterType as string | undefined;
  if (!filterType || !filterType.includes('=')) return resultado;
  const [chave, valor] = filterType.split('=');

  const filtroMap: Record<string, () => Partial<BuscaRequest>> = {
    via_cerj: () => valor === 'true' ? { viaCerj: true } : {},
    grau: () => ({ grau: valor }),
    bairro: () => ({ nomeBairro: valor }),
    exposicao: () => ({ exposicao: valor.toUpperCase() }),
    duracao: () => {
      const v = String(valor).trim().toUpperCase();
      const num = v.replace(/^D/i, '');
      return { duracao: `D${num}` };
    },
    modalidade: () => ({ modalidade: valor as any }),
    montanha: () => ({ montanhaId: parseInt(valor) }),
    paisId: () => ({ paisId: parseInt(valor) }),
    estadoId: () => ({ estadoId: parseInt(valor) }),
    cidadeId: () => ({ cidadeId: parseInt(valor) }),
    bairroId: () => ({ bairroId: parseInt(valor) }),
    sem_grau: () => ({ semGrau: true }),
    sem_localizacao: () => ({ semLocalizacao: true }),
    sort: () => valor === 'created_at_desc' ? { campoOrdenacao: 'created_at', direcaoOrdenacao: 'DESC' } : {},
  };

  const handler = filtroMap[chave];
  return handler ? { ...resultado, ...handler() } : resultado;
}

// ─── Estado ─────────────────────────────────────────────────────────

const filtrosDaQuery = parseFiltrosDaQuery();

const filtrosIniciais: BuscaRequest = {
  termoBusca: '',
  grau: null,
  faixaExtensao: null,
  exposicao: null,
  duracao: null,
  modalidade: null,
  viaCerj: null,
  pagina: 1,
  campoOrdenacao: null,
  direcaoOrdenacao: null,
  itensPorPagina: getItensPorPaginaSalvos(),
  ...props.staticFilters,
  ...filtrosDaQuery,
};

if (route.query.itemsPerPage) {
  const queryIpp = parseInt(route.query.itemsPerPage as string, 10);
  if ([10, 25, 50, 100].includes(queryIpp)) {
    filtrosIniciais.itensPorPagina = queryIpp;
  }
}

const filtros = ref(filtrosIniciais);

const resultados = ref<any[]>([]);
const totalItens = ref(0);
const totalPaginas = ref(1);
const carregando = ref(false);

// ─── Lifecycle ──────────────────────────────────────────────────────

onMounted(async () => {
  if (props.initialData && props.initialData.length) {
    resultados.value = props.initialData;
    emit('atualizar-results', resultados.value);
  } else {
    buscarEntidades();
  }
});

// ─── Busca ──────────────────────────────────────────────────────────

async function buscarEntidades() {
  if (carregando.value) return;
  carregando.value = true;

  try {
    const requisicao = {
      ...filtros.value,
      ...props.staticFilters,
      tipoEntidade: props.entity,
    };
    const resultado = await searchService.search(requisicao);

    resultados.value = resultado.items;
    totalPaginas.value = resultado.totalPages || 1;
    totalItens.value = resultado.totalItems || 0;
    emit('atualizar-results', resultados.value);
  } catch (erro) {
    console.error('Erro ao buscar entidades:', erro);
  } finally {
    carregando.value = false;
  }
}

// ─── Ordenação ──────────────────────────────────────────────────────

function atualizarOrdenacao(opcao: any) {
  filtros.value = {
    ...filtros.value,
    pagina: 1,
    campoOrdenacao: opcao.field,
    direcaoOrdenacao: opcao.direction,
  };
  buscarEntidades();
}

// ─── Paginação ──────────────────────────────────────────────────────

function onPageChange(novaPagina: number) {
  filtros.value.pagina = novaPagina;
  buscarEntidades();
}

function onItemsPerPageChange(novosItensPorPagina: number) {
  filtros.value.itensPorPagina = novosItensPorPagina;
  filtros.value.pagina = 1;

  const chave = props.entity === 'colecao' ? 'colecoes_items_per_page' : 'vias_items_per_page';
  localStorage.setItem(chave, novosItensPorPagina.toString());

  buscarEntidades();
}

// ─── Filtros ────────────────────────────────────────────────────────

function handleApplyFilters(novosFiltros: BuscaRequest) {
  filtros.value = {
    ...filtros.value,
    ...props.staticFilters,
    ...novosFiltros,
    pagina: 1,
  };
  buscarEntidades();
}

// ─── Watchers ───────────────────────────────────────────────────────

watch(
  () => filtros.value,
  (novosFiltros, filtrosAnteriores) => {
    if (novosFiltros.pagina === 1 && JSON.stringify(novosFiltros) !== JSON.stringify(filtrosAnteriores)) {
      buscarEntidades();
    }
  },
  { deep: true }
);

// ─── API pública ────────────────────────────────────────────────────

function selecionarItem(item: any) {
  emit('select', item);
}

defineExpose({ handleApplyFilters });
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.search-header {
  text-align: center;
  margin-bottom: 16px;
}

.busca-after-subheader {
  padding: 0 16px 8px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.slot-container {
  padding: 16px;
  background-color: $background;
}

.busca-bottom-spacer {
  height: 48px;
  width: 100%;
  @media (max-width: 768px) { height: 32px; }
}
</style>
