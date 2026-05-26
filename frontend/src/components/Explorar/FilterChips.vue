<template>
  <div class="filter-chips">
    <!-- Filter chip buttons -->
    <div class="chips-row">
      <!-- Grau -->
      <q-btn
        class="filter-chip"
        :class="{ active: !!filters.grau }"
        rounded
        no-caps
        @click="activePopover = activePopover === 'grau' ? null : 'grau'"
      >
        <q-icon name="signal_cellular_alt" size="16px" class="chip-icon" />
        <span>{{ filters.grau ? `Grau: ${filters.grau}` : 'Grau' }}</span>
        <q-icon :name="activePopover === 'grau' ? 'expand_less' : 'expand_more'" size="16px" class="chip-arrow" />
      </q-btn>

      <!-- Extensão -->
      <q-btn
        class="filter-chip"
        :class="{ active: !!filters.faixaExtensao }"
        rounded
        no-caps
        @click="activePopover = activePopover === 'extensao' ? null : 'extensao'"
      >
        <q-icon name="height" size="16px" class="chip-icon" />
        <span>{{ extensionLabel || 'Extensão' }}</span>
        <q-icon :name="activePopover === 'extensao' ? 'expand_less' : 'expand_more'" size="16px" class="chip-arrow" />
      </q-btn>

      <!-- Modalidade -->
      <q-btn
        class="filter-chip"
        :class="{ active: !!filters.modalidade }"
        rounded
        no-caps
        @click="activePopover = activePopover === 'modalidade' ? null : 'modalidade'"
      >
        <q-icon name="category" size="16px" class="chip-icon" />
        <span>{{ filters.modalidade ? modalidadeLabels[filters.modalidade] : 'Modalidade' }}</span>
        <q-icon :name="activePopover === 'modalidade' ? 'expand_less' : 'expand_more'" size="16px" class="chip-arrow" />
      </q-btn>

      <!-- Exposição -->
      <q-btn
        class="filter-chip"
        :class="{ active: !!filters.exposicao }"
        rounded
        no-caps
        @click="activePopover = activePopover === 'exposicao' ? null : 'exposicao'"
      >
        <q-icon name="warning_amber" size="16px" class="chip-icon" />
        <span>{{ filters.exposicao ? `Exposição: ${filters.exposicao}` : 'Exposição' }}</span>
        <q-icon :name="activePopover === 'exposicao' ? 'expand_less' : 'expand_more'" size="16px" class="chip-arrow" />
      </q-btn>

      <!-- Montanha -->
      <q-btn
        class="filter-chip"
        :class="{ active: !!filters.montanhaId }"
        rounded
        no-caps
        @click="activePopover = activePopover === 'montanha' ? null : 'montanha'"
      >
        <q-icon name="terrain" size="16px" class="chip-icon" />
        <span>{{ montanhaIdName || 'Montanha' }}</span>
        <q-icon :name="activePopover === 'montanha' ? 'expand_less' : 'expand_more'" size="16px" class="chip-arrow" />
      </q-btn>

      <!-- CERJ -->
      <q-btn
        class="filter-chip cerj-chip"
        :class="{ active: filters.viaCerj === true }"
        rounded
        no-caps
        @click="toggleCerj"
      >
        <q-icon name="emoji_events" size="16px" class="chip-icon" />
        <span>CERJ</span>
      </q-btn>

      <!-- Mais filtros -->
      <q-btn
        class="filter-chip more-chip"
        rounded
        no-caps
        @click="activePopover = activePopover === 'mais' ? null : 'mais'"
      >
        <q-icon name="tune" size="16px" class="chip-icon" />
        <span>Mais</span>
      </q-btn>

      <!-- Limpar -->
      <q-btn
        v-if="hasActiveFilters"
        class="clear-all-btn"
        rounded
        flat
        no-caps
        @click="clearAll"
      >
        <q-icon name="close" size="14px" />
        <span>Limpar</span>
      </q-btn>
    </div>

    <!-- Popover panels -->
    <transition name="slide-fade">
      <div v-if="activePopover" class="popover-panel">
        <!-- Grau -->
        <div v-if="activePopover === 'grau'" class="popover-content">
          <div class="popover-title">Selecione o grau</div>
          <div class="options-grid">
            <q-btn
              v-for="d in difficulties"
              :key="d"
              class="option-btn"
              :class="{ selected: filters.grau === d }"
              no-caps
              @click="selectFilter('grau', d)"
            >{{ d }}</q-btn>
          </div>
        </div>

        <!-- Extensão -->
        <div v-if="activePopover === 'extensao'" class="popover-content">
          <div class="popover-title">Faixa de extensão</div>
          <div class="options-list">
            <q-btn
              v-for="(range, label) in extensionCategories"
              :key="label"
              class="option-btn-wide"
              :class="{ selected: JSON.stringify(filters.faixaExtensao) === JSON.stringify(range) }"
              no-caps
              @click="selectExtension(label)"
            >{{ label }}</q-btn>
          </div>
        </div>

        <!-- Modalidade -->
        <div v-if="activePopover === 'modalidade'" class="popover-content">
          <div class="popover-title">Modalidade de escalada</div>
          <div class="options-list">
            <q-btn
              v-for="m in modalidadeOptions"
              :key="m"
              class="option-btn-wide"
              :class="{ selected: filters.modalidade === m }"
              no-caps
              @click="selectFilter('modalidade', m)"
            >{{ modalidadeLabels[m] }}</q-btn>
          </div>
        </div>

        <!-- Exposição -->
        <div v-if="activePopover === 'exposicao'" class="popover-content">
          <div class="popover-title">Nível de exposição</div>
          <div class="options-grid">
            <q-btn
              v-for="e in exposures"
              :key="e"
              class="option-btn"
              :class="{ selected: filters.exposicao === e }"
              no-caps
              @click="selectFilter('exposicao', e)"
            >{{ e.toUpperCase() }}</q-btn>
          </div>
        </div>

        <!-- Montanha -->
        <div v-if="activePopover === 'montanha'" class="popover-content">
          <div class="popover-title">Selecione a montanha</div>
          <q-input
            v-model="mountainSearch"
            placeholder="Filtrar montanhas..."
            outlined
            dense
            class="mountain-search"
          />
          <div class="options-list scrollable">
            <q-btn
              v-for="m in filteredMountains"
              :key="m.id"
              class="option-btn-wide"
              :class="{ selected: filters.montanhaId === m.id }"
              no-caps
              @click="selectMountain(m)"
            >{{ m.nome }}</q-btn>
          </div>
        </div>

        <!-- Mais filtros -->
        <div v-if="activePopover === 'mais'" class="popover-content">
          <div class="popover-title">Filtros adicionais</div>

          <div class="extra-filter-group">
            <label class="extra-label">Crux</label>
            <q-select
              v-model="filters.crux"
              :options="difficulties"
              outlined
              dense
              clearable
              class="extra-select"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="extra-filter-group">
            <label class="extra-label">Tipo de rocha</label>
            <q-input
              v-model="filters.tipoRocha"
              placeholder="Ex: granito, calcário..."
              outlined
              dense
              class="extra-select"
              @update:model-value="emitFilters"
            />
          </div>

          <div class="extra-filter-group">
            <label class="extra-label">Tipo de escalada</label>
            <q-input
              v-model="filters.tipoEscalada"
              placeholder="Ex: aderência, chaminé..."
              outlined
              dense
              class="extra-select"
              @update:model-value="emitFilters"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Active filter tags -->
    <div v-if="activeFilterTags.length > 0" class="active-tags">
      <div
        v-for="tag in activeFilterTags"
        :key="tag.key"
        class="active-tag"
      >
        <span>{{ tag.label }}</span>
        <q-icon name="close" size="14px" class="tag-remove" @click="removeFilter(tag.key)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { ModalidadeEscalada } from 'src/models/ModalidadeEscalada';
import montanhaService from 'src/services/MontanhaService';

const emit = defineEmits<{
  'update': [filters: Record<string, any>];
}>();

const filters = reactive<{
  grau: string | null;
  faixaExtensao: number[] | null;
  crux: string | null;
  exposicao: string | null;
  montanhaId: number | null;
  modalidade: ModalidadeEscalada | null;
  viaCerj: boolean | null;
  tipoRocha: string | null;
  tipoEscalada: string | null;
}>({
  grau: null,
  faixaExtensao: null,
  crux: null,
  exposicao: null,
  montanhaId: null,
  modalidade: null,
  viaCerj: null,
  tipoRocha: null,
  tipoEscalada: null
});

const activePopover = ref<string | null>(null);
const mountainSearch = ref('');
const mountainOptions = ref<any[]>([]);

const difficulties = [
  '1', 'Isup', '2', '3', '4', '5',
  'IIsup', 'IIIsup', 'IVsup', 'Vsup', 'VIIb', '6', 'VIsup', 'VIIa',
  'VIIIb', 'VIIc', 'VIIIc', 'IXa', 'Xa', 'VII(3)', '7', 'V(2)', 'VIII', 'VIIIa'
];

const exposures = ['e1', 'e2', 'e3', 'e4', 'e5'];

const extensionCategories: Record<string, number[]> = {
  'Menor que 50m': [0, 50],
  '50 a 100m': [50, 100],
  '100 a 200m': [100, 200],
  '200 a 300m': [200, 300],
  'Mais de 300m': [300, 99999]
};

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

const filteredMountains = computed(() => {
  if (!mountainSearch.value) return mountainOptions.value;
  const search = mountainSearch.value.toLowerCase();
  return mountainOptions.value.filter((m: any) => m.nome.toLowerCase().includes(search));
});

const montanhaIdName = computed(() => {
  if (!filters.montanhaId) return '';
  const m = mountainOptions.value.find((m: any) => m.id === filters.montanhaId);
  return m ? m.nome : '';
});

const extensionLabel = computed(() => {
  if (!filters.faixaExtensao) return '';
  const entry = Object.entries(extensionCategories).find(
    ([, range]) => JSON.stringify(range) === JSON.stringify(filters.faixaExtensao)
  );
  return entry ? entry[0] : '';
});

const hasActiveFilters = computed(() => {
  return filters.grau || filters.faixaExtensao ||
    filters.crux || filters.exposicao || filters.montanhaId ||
    filters.modalidade || filters.viaCerj || filters.tipoRocha || filters.tipoEscalada;
});

const activeFilterTags = computed(() => {
  const tags: { label: string; key: string }[] = [];
  if (filters.grau) tags.push({ label: `Grau: ${filters.grau}`, key: 'grau' });
  if (filters.faixaExtensao) tags.push({ label: extensionLabel.value, key: 'faixaExtensao' });
  if (filters.crux) tags.push({ label: `Crux: ${filters.crux}`, key: 'crux' });
  if (filters.exposicao) tags.push({ label: `Exp: ${filters.exposicao.toUpperCase()}`, key: 'exposicao' });
  if (filters.montanhaId) tags.push({ label: montanhaIdName.value, key: 'montanhaId' });
  if (filters.modalidade) tags.push({ label: modalidadeLabels[filters.modalidade], key: 'modalidade' });
  if (filters.viaCerj) tags.push({ label: 'Clássicas CERJ', key: 'viaCerj' });
  if (filters.tipoRocha) tags.push({ label: `Rocha: ${filters.tipoRocha}`, key: 'tipoRocha' });
  if (filters.tipoEscalada) tags.push({ label: `Tipo: ${filters.tipoEscalada}`, key: 'tipoEscalada' });
  return tags;
});

onMounted(async () => {
  try {
    mountainOptions.value = await montanhaService.getAll();
  } catch (e) {
    console.error('Erro ao carregar montanhas:', e);
  }
});

const selectFilter = (key: string, value: any) => {
  const current = (filters as any)[key];
  (filters as any)[key] = current === value ? null : value;
  activePopover.value = null;
  emitFilters();
};

const selectExtension = (label: string) => {
  const range = extensionCategories[label];
  const isSame = JSON.stringify(filters.faixaExtensao) === JSON.stringify(range);
  filters.faixaExtensao = isSame ? null : range;
  activePopover.value = null;
  emitFilters();
};

const selectMountain = (m: any) => {
  filters.montanhaId = filters.montanhaId === m.id ? null : m.id;
  activePopover.value = null;
  emitFilters();
};

const toggleCerj = () => {
  filters.viaCerj = filters.viaCerj ? null : true;
  emitFilters();
};

const removeFilter = (key: string) => {
  (filters as any)[key] = null;
  emitFilters();
};

const clearAll = () => {
  Object.keys(filters).forEach(key => {
    (filters as any)[key] = null;
  });
  activePopover.value = null;
  emitFilters();
};

const emitFilters = () => {
  emit('update', { ...filters });
};

const setFilters = (incoming: Record<string, any>) => {
  Object.entries(incoming).forEach(([key, value]) => {
    if (key in filters) {
      (filters as any)[key] = value;
    }
  });
};

defineExpose({ setFilters });
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.filter-chips {
  width: 100%;
}

.chips-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-chip {
  background: rgba($offwhite, 0.08) !important;
  border: 1.5px solid rgba($cumes-01, 0.25) !important;
  color: rgba($offwhite, 0.85) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 6px 14px !important;
  text-transform: none !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;

  &:hover {
    background: rgba($cumes-01, 0.12) !important;
    border-color: rgba($cumes-01, 0.5) !important;
  }

  &.active {
    background: rgba($cumes-01, 0.2) !important;
    border-color: $cumes-01 !important;
    color: $offwhite !important;
  }
}

.cerj-chip.active {
  background: rgba($cumes-04, 0.2) !important;
  border-color: $cumes-04 !important;
}

.chip-icon {
  font-size: 16px !important;
  opacity: 0.7;
}

.chip-arrow {
  font-size: 16px !important;
  opacity: 0.5;
}

.clear-all-btn {
  color: rgba($offwhite, 0.5) !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  padding: 4px 10px !important;
  gap: 4px !important;

  &:hover {
    color: $error-color !important;
  }
}

.popover-panel {
  margin-top: 12px;
  background: cumesLighten($background, 6%);
  border: 1px solid rgba($cumes-01, 0.2);
  border-radius: 16px;
  overflow: hidden;
}

.popover-content {
  padding: 20px;
}

.popover-title {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 14px;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.scrollable {
    max-height: 200px;
    overflow-y: auto;
  }
}

.option-btn,
.option-btn-wide {
  background: rgba($offwhite, 0.06) !important;
  border: 1.5px solid rgba($offwhite, 0.12) !important;
  color: rgba($offwhite, 0.8) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  transition: all 0.15s ease !important;
  text-transform: none !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
    border-color: rgba($cumes-01, 0.4) !important;
  }

  &.selected {
    background: $cumes-01 !important;
    border-color: $cumes-01 !important;
    color: $offwhite !important;
  }
}

.option-btn {
  min-width: 50px !important;
  padding: 8px 14px !important;
  border-radius: 10px !important;
}

.option-btn-wide {
  width: 100% !important;
  padding: 10px 16px !important;
  border-radius: 10px !important;
  justify-content: flex-start !important;
}

.mountain-search {
  margin-bottom: 12px;

  :deep(.q-field__control) {
    background-color: rgba($offwhite, 0.06) !important;
    border-radius: 10px !important;

    &::before {
      border-color: rgba($offwhite, 0.15) !important;
    }
  }

  :deep(.q-field__native) {
    color: $offwhite !important;
    font-size: 14px !important;
  }
}

.extra-filter-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.extra-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.extra-select {
  :deep(.q-field__control) {
    background-color: rgba($offwhite, 0.06) !important;
    border-radius: 10px !important;

    &::before {
      border-color: rgba($offwhite, 0.15) !important;
    }
  }

  :deep(.q-field__native) {
    color: $offwhite !important;
    font-size: 14px !important;
  }
}

.active-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.active-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba($cumes-03, 0.15);
  border: 1px solid rgba($cumes-03, 0.3);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: $cumes-03;

  .tag-remove {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
