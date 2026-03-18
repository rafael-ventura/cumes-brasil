<template>
  <div class="location-explorer">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span
        class="breadcrumb-item clickable"
        @click="navigateToLevel(-1)"
      >
        <q-icon name="public" size="18px" class="breadcrumb-icon" />
        Todos
      </span>
      <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
        <q-icon name="chevron_right" size="16px" class="breadcrumb-separator" />
        <span
          class="breadcrumb-item"
          :class="{ clickable: idx < breadcrumbs.length - 1, active: idx === breadcrumbs.length - 1 }"
          @click="idx < breadcrumbs.length - 1 ? navigateToLevel(idx) : null"
        >
          {{ crumb.nome }}
        </span>
      </template>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="cards-grid">
      <div v-for="i in 4" :key="i" class="location-card skeleton-card">
        <q-skeleton type="text" width="60%" />
        <q-skeleton type="text" width="40%" class="q-mt-sm" />
      </div>
    </div>

    <!-- Location cards -->
    <div v-else-if="currentItems.length > 0" class="cards-grid">
      <div
        v-for="item in currentItems"
        :key="item.id"
        class="location-card"
        @click="drillDown(item)"
      >
        <div class="card-icon-wrapper">
          <q-icon :name="levelIcon" size="24px" class="card-icon" />
        </div>
        <div class="card-content">
          <div class="card-name">{{ item.nome }}</div>
          <div class="card-count">
            {{ item.totalVias }} {{ item.totalVias === 1 ? 'via' : 'vias' }}
          </div>
        </div>
        <q-icon name="chevron_right" size="20px" class="card-arrow" />
      </div>
    </div>

    <!-- Montanhas (leaf level) -->
    <div v-else-if="currentMontanhas.length > 0" class="cards-grid">
      <div
        v-for="m in currentMontanhas"
        :key="m.id"
        class="location-card montanha-card"
        @click="$emit('selectMontanha', m.id)"
      >
        <div class="card-icon-wrapper montanha-icon-wrapper">
          <q-icon name="terrain" size="24px" class="card-icon" />
        </div>
        <div class="card-content">
          <div class="card-name">{{ m.nome }}</div>
          <div class="card-count">
            {{ m.totalVias }} {{ m.totalVias === 1 ? 'via' : 'vias' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <q-icon name="explore_off" size="32px" />
      <span>Nenhuma localização encontrada neste nível</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { LocationNode } from 'src/services/LocalizacaoService';

const props = defineProps<{
  hierarchy: LocationNode[];
  loading: boolean;
}>();

const emit = defineEmits<{
  'locationChange': [filters: { paisId?: number; estadoId?: number; cidadeId?: number; bairroId?: number }];
  'selectMontanha': [id: number];
}>();

type Level = 'pais' | 'estado' | 'cidade' | 'bairro' | 'montanha';

interface BreadcrumbItem {
  nome: string;
  level: Level;
  id: number;
}

const breadcrumbs = ref<BreadcrumbItem[]>([]);
const currentLevel = ref<Level>('pais');

const levelIcons: Record<Level, string> = {
  pais: 'flag',
  estado: 'map',
  cidade: 'location_city',
  bairro: 'place',
  montanha: 'terrain'
};

const levelIcon = computed(() => levelIcons[currentLevel.value] || 'place');

const currentItems = computed((): LocationNode[] => {
  if (!props.hierarchy.length) return [];

  let items: LocationNode[] = props.hierarchy;

  for (const crumb of breadcrumbs.value) {
    const found = items.find(i => i.id === crumb.id);
    if (!found) return [];

    if (crumb.level === 'pais') items = found.estados || [];
    else if (crumb.level === 'estado') items = found.cidades || [];
    else if (crumb.level === 'cidade') {
      if (found.bairros && found.bairros.length > 0) {
        items = found.bairros;
      } else {
        items = [];
      }
    }
    else if (crumb.level === 'bairro') items = [];
  }

  return items;
});

const currentMontanhas = computed((): Array<{ id: number; nome: string; totalVias: number }> => {
  if (!props.hierarchy.length || breadcrumbs.value.length === 0) return [];

  let items: LocationNode[] = props.hierarchy;
  let lastNode: LocationNode | undefined;

  for (const crumb of breadcrumbs.value) {
    const found = items.find(i => i.id === crumb.id);
    if (!found) return [];
    lastNode = found;

    if (crumb.level === 'pais') items = found.estados || [];
    else if (crumb.level === 'estado') items = found.cidades || [];
    else if (crumb.level === 'cidade') {
      if (found.bairros && found.bairros.length > 0) {
        items = found.bairros;
      } else {
        return found.montanhas || [];
      }
    }
    else if (crumb.level === 'bairro') {
      return found.montanhas || [];
    }
  }

  if (currentItems.value.length === 0 && lastNode?.montanhas) {
    return lastNode.montanhas;
  }

  return [];
});

const levelOrder: Level[] = ['pais', 'estado', 'cidade', 'bairro', 'montanha'];

const drillDown = (item: LocationNode) => {
  const nextLevelIdx = levelOrder.indexOf(currentLevel.value) + 1;
  const nextLevel = levelOrder[nextLevelIdx] || 'montanha';

  breadcrumbs.value.push({
    nome: item.sigla || item.nome,
    level: currentLevel.value,
    id: item.id
  });

  currentLevel.value = nextLevel as Level;
  emitLocationFilters();
};

const navigateToLevel = (idx: number) => {
  if (idx < 0) {
    breadcrumbs.value = [];
    currentLevel.value = 'pais';
  } else {
    breadcrumbs.value = breadcrumbs.value.slice(0, idx + 1);
    const lastCrumb = breadcrumbs.value[breadcrumbs.value.length - 1];
    const lastIdx = levelOrder.indexOf(lastCrumb.level);
    currentLevel.value = (levelOrder[lastIdx + 1] || 'montanha') as Level;
  }
  emitLocationFilters();
};

const emitLocationFilters = () => {
  const filters: { paisId?: number; estadoId?: number; cidadeId?: number; bairroId?: number } = {};

  for (const crumb of breadcrumbs.value) {
    if (crumb.level === 'pais') filters.paisId = crumb.id;
    else if (crumb.level === 'estado') filters.estadoId = crumb.id;
    else if (crumb.level === 'cidade') filters.cidadeId = crumb.id;
    else if (crumb.level === 'bairro') filters.bairroId = crumb.id;
  }

  emit('locationChange', filters);
};

watch(() => props.hierarchy, () => {
  if (breadcrumbs.value.length === 0) {
    currentLevel.value = 'pais';
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.location-explorer {
  width: 100%;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.breadcrumb-icon {
  color: $cumes-03;
  margin-right: 4px;
}

.breadcrumb-item {
  font-size: 14px;
  font-weight: 600;
  color: rgba($offwhite, 0.6);
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &.clickable {
    cursor: pointer;
    &:hover {
      color: $cumes-03;
    }
  }

  &.active {
    color: $cumes-04;
  }
}

.breadcrumb-separator {
  color: rgba($offwhite, 0.3);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }
}

.location-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba($offwhite, 0.06);
  border: 1px solid rgba($cumes-01, 0.2);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba($cumes-01, 0.12);
    border-color: rgba($cumes-01, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.montanha-card {
  border-color: rgba($cumes-03, 0.3);

  &:hover {
    background: rgba($cumes-03, 0.1);
    border-color: rgba($cumes-03, 0.5);
  }
}

.card-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba($cumes-01, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.montanha-icon-wrapper {
  background: rgba($cumes-03, 0.15);

  .card-icon {
    color: $cumes-03;
  }
}

.card-icon {
  color: $cumes-01;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 15px;
  font-weight: 700;
  color: $offwhite;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-count {
  font-size: 12px;
  color: rgba($offwhite, 0.5);
  margin-top: 2px;
}

.card-arrow {
  color: rgba($offwhite, 0.3);
  flex-shrink: 0;
}

.skeleton-card {
  padding: 20px;
  cursor: default;

  &:hover {
    transform: none;
    box-shadow: none;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: rgba($offwhite, 0.4);
  font-size: 14px;
  font-style: italic;
}
</style>
