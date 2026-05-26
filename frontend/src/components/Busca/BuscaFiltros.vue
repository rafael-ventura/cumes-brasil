<template>
  <div class="busca-filtros" :class="{ 'busca-filtros--compacto': compact }">
    <!-- Campo de busca unificado -->
    <div class="busca-input-wrapper">
      <q-input
        v-model="localFilters.termoBusca"
        :label="compact ? undefined : (unifiedSearchLabel || 'Buscar por nome, bairro ou localização')"
        :placeholder="compact ? (unifiedSearchLabel || 'Buscar…') : undefined"
        debounce="300"
        outlined
        color="secondary"
        label-color="secondary"
        class="busca-input"
        :dense="compact"
        hide-bottom-space
        rounded
        @keydown="onInputChange"
      >
        <template #prepend>
          <q-icon name="search" class="icone-lupa-busca" />
        </template>
        <template #append>
          <div class="append-actions">
            <q-icon
              v-if="entity === 'via'"
              name="tune"
              class="cursor-pointer icone-filtro"
              :class="{ ativo: temFiltrosAtivos }"
              @click="painelAberto = true"
            />
            <q-icon
              v-if="temFiltrosAtivos"
              name="delete"
              class="cursor-pointer icone-limpar"
              @click="limparTudo"
            />
          </div>
        </template>
      </q-input>
    </div>

    <!-- Filtros ativos (tags) -->
    <div v-if="listaFiltrosAtivos.length > 0" class="filtros-ativos">
      <div
        v-for="filtro in listaFiltrosAtivos"
        :key="filtro.key"
        class="filtro-tag"
      >
        <span>{{ filtro.label }}</span>
        <q-icon
          name="close"
          class="tag-remover"
          @click="removerFiltro(filtro.key)"
        />
      </div>
    </div>

    <!-- Painel de Filtros (Teleport para body para ficar acima de tudo) -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="painelAberto"
          class="filtros-backdrop"
          @click="fecharPainel"
        />
      </transition>
      <transition name="painel">
        <div v-if="painelAberto" class="filtros-painel">
          <!-- Header sticky -->
          <div class="painel-header">
            <div class="header-esquerda">
              <q-icon name="tune" size="20px" class="header-icone" />
              <span class="header-titulo">Filtros</span>
            </div>
            <div class="header-direita">
              <button
                v-if="temFiltrosAtivos"
                class="btn-limpar-header"
                @click="limparFiltrosVia"
              >Limpar tudo</button>
              <q-icon
                name="close"
                size="22px"
                class="cursor-pointer btn-fechar"
                @click="fecharPainel"
              />
            </div>
          </div>

          <!-- Body scrollable -->
          <div class="painel-body">
            <!-- Grau -->
            <div class="filtro-secao">
              <div class="secao-label">Grau</div>
              <div class="chips-grid">
                <button
                  v-for="g in grauOptions"
                  :key="'grau-' + g"
                  class="chip chip-grau"
                  :class="{ selected: localFilters.grau === g }"
                  @click="toggleChip('grau', g)"
                >{{ g }}</button>
              </div>
            </div>

            <!-- Extensão -->
            <div class="filtro-secao">
              <div class="secao-label">Extensão</div>
              <div class="chips-grid">
                <button
                  v-for="(range, label) in extensionCategories"
                  :key="label"
                  class="chip chip-wide"
                  :class="{ selected: extensaoSelecionada(range) }"
                  @click="toggleExtensao(label)"
                >{{ label }}</button>
              </div>
            </div>

            <!-- Exposição -->
            <div class="filtro-secao">
              <div class="secao-label">Exposição</div>
              <div class="chips-grid">
                <button
                  v-for="e in exposures"
                  :key="e"
                  class="chip"
                  :class="{ selected: localFilters.exposicao === e }"
                  @click="toggleChip('exposicao', e)"
                >{{ e.toUpperCase() }}</button>
              </div>
            </div>

            <!-- Duração (D1–D7) -->
            <div class="filtro-secao">
              <div class="secao-label">Duração</div>
              <div class="chips-grid">
                <button
                  v-for="d in duracoes"
                  :key="d"
                  class="chip"
                  :class="{ selected: localFilters.duracao === d }"
                  @click="toggleChip('duracao', d)"
                >{{ d }}</button>
              </div>
            </div>

            <!-- Artificial -->
            <div class="filtro-secao">
              <div class="secao-label">Artificial</div>
              <div class="chips-grid">
                <button
                  v-for="a in artificialOptions"
                  :key="'art-' + a"
                  class="chip"
                  :class="{ selected: localFilters.artificial === a }"
                  @click="toggleChip('artificial', a)"
                >{{ a }}</button>
              </div>
            </div>

            <!-- Modalidade -->
            <div class="filtro-secao">
              <div class="secao-label">Modalidade</div>
              <div class="chips-grid">
                <button
                  v-for="m in modalidadeOptions"
                  :key="m"
                  class="chip chip-wide"
                  :class="{ selected: localFilters.modalidade === m }"
                  @click="toggleChip('modalidade', m)"
                >{{ modalidadeLabels[m] }}</button>
              </div>
            </div>

            <!-- Montanha -->
            <div class="filtro-secao">
              <div class="secao-label">Montanha</div>
              <q-select
                v-model="localFilters.montanhaId"
                :options="filteredMountains"
                option-label="nome"
                option-value="id"
                map-options
                emit-value
                outlined
                dense
                clearable
                use-input
                input-debounce="150"
                class="filtro-select"
                placeholder="Buscar montanha..."
                @filter="onFilterMountains"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Nenhuma encontrada</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Clássicas CERJ -->
            <div class="filtro-secao">
              <button
                class="chip chip-cerj"
                :class="{ selected: localFilters.viaCerj === true }"
                @click="localFilters.viaCerj = localFilters.viaCerj ? null : true"
              >
                <q-icon name="emoji_events" size="16px" />
                <span>Apenas Clássicas CERJ</span>
              </button>
            </div>
          </div>

          <!-- Footer sticky -->
          <div class="painel-footer">
            <button class="btn-aplicar" @click="fecharPainel">
              Aplicar filtros
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, withDefaults } from 'vue';
import { BuscaRequest } from 'src/models/BuscaRequest';
import montanhaService from 'src/services/MontanhaService';
import { ModalidadeEscalada } from 'src/models/ModalidadeEscalada';

const props = withDefaults(
  defineProps<{
    entity: string;
    filters?: Partial<BuscaRequest>;
    staticFilters?: Partial<any>;
    unifiedSearchLabel?: string;
    enabledFilters?: string[];
    /** Barras mais baixas e integradas ao tema escuro (coleções, favoritas, escaladas) */
    compact?: boolean;
  }>(),
  { compact: false }
);

const emit = defineEmits(['applyFilters']);

// --- Estado ---

const painelAberto = ref(false);
const isSyncingFromProps = ref(false);

const localFilters = ref<BuscaRequest>({
  termoBusca: '',
  montanhaId: null,
  viaCerj: null,
  grau: null,
  faixaExtensao: null,
  exposicao: null,
  duracao: null,
  artificial: null,
  modalidade: null,
  pagina: 1,
  itensPorPagina: 10
});

// --- Dados de referência ---

const grauOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

const exposures = ['e1', 'e2', 'e3', 'e4', 'e5'];

const duracoes = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

const extensionCategories: Record<string, number[]> = {
  '< 50m': [0, 50],
  '50–100m': [50, 100],
  '100–200m': [100, 200],
  '200–300m': [200, 300],
  '> 300m': [300, 99999]
};

const artificialOptions = ['A0', 'A1', 'A2', 'A2+', 'A3', 'C'];

const modalidadeOptions = [
  ModalidadeEscalada.TRADICIONAL,
  ModalidadeEscalada.ESPORTIVA,
  ModalidadeEscalada.BOULDER,
  ModalidadeEscalada.BIG_WALL,
  ModalidadeEscalada.ARTIFICIAL,
  ModalidadeEscalada.PSICOBLOC
];

const modalidadeLabels: Record<ModalidadeEscalada, string> = {
  [ModalidadeEscalada.TRADICIONAL]: 'Tradicional',
  [ModalidadeEscalada.ESPORTIVA]: 'Esportiva',
  [ModalidadeEscalada.BOULDER]: 'Boulder',
  [ModalidadeEscalada.BIG_WALL]: 'Big Wall',
  [ModalidadeEscalada.ARTIFICIAL]: 'Artificial',
  [ModalidadeEscalada.PSICOBLOC]: 'Psicobloc'
};

const mountainOptions = ref<any[]>([]);
const filteredMountains = ref<any[]>([]);

// --- Computed ---

const temFiltrosAtivos = computed(() => {
  const f = localFilters.value;
  return !!(f.grau || f.faixaExtensao || f.exposicao || f.duracao ||
    f.artificial || f.modalidade ||
    f.montanhaId || f.viaCerj === true);
});

const listaFiltrosAtivos = computed(() => {
  const tags: { label: string; key: string }[] = [];
  const f = localFilters.value;

  if (f.grau) tags.push({ label: `Grau: ${f.grau}`, key: 'grau' });
  if (f.faixaExtensao) {
    const nome = Object.entries(extensionCategories).find(
      ([, range]) => JSON.stringify(range) === JSON.stringify(f.faixaExtensao)
    )?.[0];
    if (nome) tags.push({ label: `Extensão: ${nome}`, key: 'faixaExtensao' });
  }
  if (f.artificial) tags.push({ label: `Artificial: ${f.artificial}`, key: 'artificial' });
  if (f.exposicao) tags.push({ label: `Exposição: ${f.exposicao}`, key: 'exposicao' });
  if (f.duracao) tags.push({ label: `Duração: ${f.duracao}`, key: 'duracao' });
  if (f.modalidade) {
    tags.push({ label: modalidadeLabels[f.modalidade] || String(f.modalidade), key: 'modalidade' });
  }
  if (f.viaCerj === true) tags.push({ label: 'Clássicas CERJ', key: 'viaCerj' });
  if (f.montanhaId) {
    const m = mountainOptions.value.find((m: any) => m.id === f.montanhaId);
    if (m) tags.push({ label: `Montanha: ${m.nome}`, key: 'montanhaId' });
  }

  return tags;
});

// --- Ações ---

function toggleChip(field: string, value: any) {
  const current = (localFilters.value as any)[field];
  (localFilters.value as any)[field] = current === value ? null : value;
}

function extensaoSelecionada(range: number[]): boolean {
  return JSON.stringify(localFilters.value.faixaExtensao) === JSON.stringify(range);
}

function toggleExtensao(label: string) {
  const range = extensionCategories[label];
  if (extensaoSelecionada(range)) {
    localFilters.value.faixaExtensao = null;
  } else {
    localFilters.value.faixaExtensao = range;
  }
}

function removerFiltro(key: string) {
  (localFilters.value as any)[key] = null;
  emitFilters();
}

function limparFiltrosVia() {
  localFilters.value = {
    ...localFilters.value,
    grau: null,
    artificial: null,
    faixaExtensao: null,
    exposicao: null,
    duracao: null,
    modalidade: null,
    montanhaId: null,
    viaCerj: null,
    nomeBairro: null,
  };
}

function limparTudo() {
  localFilters.value = {
    termoBusca: '',
    montanhaId: null,
    viaCerj: null,
    nomeBairro: '',
    exposicao: null,
    duracao: null,
    grau: null,
    faixaExtensao: null,
    artificial: null,
    modalidade: null,
    pagina: 1,
    itensPorPagina: localFilters.value.itensPorPagina,
    ...props.staticFilters
  };
  emitFilters();
}

function fecharPainel() {
  emitFilters();
  painelAberto.value = false;
}

function emitFilters() {
  emit('applyFilters', { ...localFilters.value, ...props.staticFilters });
}

function onFilterMountains(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    filteredMountains.value = needle
      ? mountainOptions.value.filter((m: any) => m.nome.toLowerCase().includes(needle))
      : mountainOptions.value;
  });
}

const onInputChange = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value;
  if (value.length >= 2 || value.length === 0) {
    emitFilters();
  }
};

// --- Scroll lock ---

watch(painelAberto, (aberto) => {
  document.body.style.overflow = aberto ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

// --- Sync de props (filtros vindos da URL) ---

watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters && Object.keys(newFilters).length) {
      isSyncingFromProps.value = true;
      localFilters.value = { ...localFilters.value, ...newFilters };
      nextTick(() => { isSyncingFromProps.value = false; });
    }
  },
  { immediate: true, deep: true }
);

// --- Emissão automática ao mudar filtros ---

watch(
  () => localFilters.value,
  (newFilters, oldFilters) => {
    if (isSyncingFromProps.value) return;
    if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
      emitFilters();
    }
  },
  { deep: true }
);

// --- Init ---

onMounted(async () => {
  try {
    mountainOptions.value = await montanhaService.getAll();
    filteredMountains.value = mountainOptions.value;
  } catch (error) {
    console.error('Erro ao carregar montanhas:', error);
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

// ================================
// SEARCH INPUT
// ================================
.busca-input-wrapper {
  padding-top: 16px;
}

.busca-filtros--compacto .busca-input-wrapper {
  padding-top: 0;
}

.busca-input {
  @include campo-busca-primario(12px, 52px);
}

.busca-filtros--compacto .busca-input {
  :deep(.q-field__control) {
    min-height: 40px !important;
    background-color: rgba($surface, 0.72) !important;
    border-radius: 10px !important;

    &::before {
      border-color: rgba($cumes-01, 0.3) !important;
      border-width: 1px !important;
    }
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    color: $offwhite !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 8px 6px 8px 4px !important;
  }

  :deep(input::placeholder) {
    color: rgba($offwhite, 0.42) !important;
  }

  &:deep(.q-field--focused) .q-field__control::before {
    border-color: rgba($cumes-01, 0.55) !important;
  }
}

.icone-lupa-busca {
  color: $cumes-03 !important;
  font-size: 22px !important;
}

.busca-filtros--compacto .icone-lupa-busca {
  color: $cumes-01 !important;
  font-size: 20px !important;
}

.append-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 4px;
}

.icone-filtro {
  font-size: 22px !important;
  color: rgba($background, 0.6) !important;
  transition: all 0.2s ease;

  &.ativo {
    color: $cumes-01 !important;
  }

  &:hover {
    color: $cumes-01 !important;
    transform: scale(1.1);
  }
}

.icone-limpar {
  font-size: 20px !important;
  color: rgba($background, 0.4) !important;
  transition: all 0.2s ease;

  &:hover {
    color: $error-color !important;
  }
}

// ================================
// FILTROS ATIVOS (TAGS)
// ================================
.filtros-ativos {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro-tag {
  background: rgba($cumes-01, 0.15);
  border: 1px solid rgba($cumes-01, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    color: $cumes-01 !important;
    font-weight: 600;
    font-size: 12px;
  }
}

.tag-remover {
  font-size: 14px;
  cursor: pointer;
  color: rgba($cumes-01, 0.6) !important;
  transition: color 0.15s;

  &:hover {
    color: $error-color !important;
  }
}

// ================================
// BACKDROP
// ================================
.filtros-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ================================
// PAINEL
// ================================
.filtros-painel {
  position: fixed;
  z-index: 6000;
  background: $background;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba($cumes-01, 0.2);

  // Mobile: bottom sheet
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 88vh;
  border-radius: 20px 20px 0 0;

  @media (min-width: 768px) {
    top: 0;
    right: 0;
    bottom: 0;
    left: auto;
    width: 400px;
    max-height: 100vh;
    border-radius: 0;
    border-left: 2px solid rgba($cumes-01, 0.25);
    border-top: none;
  }
}

// Transition: slide up (mobile) / slide right (desktop)
.painel-enter-active,
.painel-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.painel-enter-from,
.painel-leave-to {
  transform: translateY(100%);

  @media (min-width: 768px) {
    transform: translateX(100%);
  }
}

// ================================
// PAINEL HEADER
// ================================
.painel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba($offwhite, 0.08);
  flex-shrink: 0;

  // Barra de arraste visual no mobile
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: rgba($offwhite, 0.2);

    @media (min-width: 768px) {
      display: none;
    }
  }
}

.header-esquerda {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icone {
  color: $cumes-01;
}

.header-titulo {
  font-size: 18px;
  font-weight: 700;
  color: $offwhite;
}

.header-direita {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-limpar-header {
  background: none;
  border: none;
  color: rgba($offwhite, 0.5);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;

  &:hover {
    color: $error-color;
    background: rgba($error-color, 0.1);
  }
}

.btn-fechar {
  color: rgba($offwhite, 0.5) !important;
  transition: color 0.15s;

  &:hover {
    color: $offwhite !important;
  }
}

// ================================
// PAINEL BODY
// ================================
.painel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 24px;
}

// ================================
// SEÇÕES DE FILTRO
// ================================
.filtro-secao {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.secao-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba($offwhite, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

// ================================
// CHIPS
// ================================
.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  background: rgba($offwhite, 0.06);
  border: 1.5px solid rgba($offwhite, 0.1);
  color: rgba($offwhite, 0.7);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;

  &:hover {
    background: rgba($cumes-01, 0.08);
    border-color: rgba($cumes-01, 0.3);
    color: rgba($offwhite, 0.9);
  }

  &.selected {
    background: rgba($cumes-01, 0.2);
    border-color: $cumes-01;
    color: $offwhite;
  }
}

.chip-grau {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.chip-wide {
  padding: 7px 16px;
}

.chip-cerj {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 10px;

  &.selected {
    background: rgba($cumes-04, 0.15);
    border-color: $cumes-04;
    color: $cumes-04;
  }
}

// ================================
// SELECT E INPUT DENTRO DO PAINEL
// ================================
.filtro-select {
  :deep(.q-field__control) {
    background: rgba($offwhite, 0.06) !important;
    border-radius: 10px !important;

    &::before {
      border-color: rgba($offwhite, 0.12) !important;
    }
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    color: $offwhite !important;
    font-size: 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($offwhite, 0.35) !important;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: rgba($cumes-01, 0.5) !important;
    }
  }

  :deep(.q-field__append) {
    color: rgba($offwhite, 0.4) !important;
  }
}

// ================================
// PAINEL FOOTER
// ================================
.painel-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba($offwhite, 0.08);
  flex-shrink: 0;

  // Padding extra no mobile para safe area
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.btn-aplicar {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: $cumes-01;
  color: $offwhite;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: cumesDarken($cumes-01, 8%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px $box-shadow-medium;
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
