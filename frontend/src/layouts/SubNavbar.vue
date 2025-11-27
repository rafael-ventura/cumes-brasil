<template>
  <q-tabs
    v-model="activeTab"
    class="text-h6 text-white"
    :active-color="activeColor"
    :class="tabsClass"
    align="justify"
    dense
  >
    <q-tab 
      name="colecoes" 
      label="Coleções" 
      @click="navigateToTab('colecoes')"
      class="tab-colecoes"
    />
    <q-tab 
      name="favoritas" 
      label="Favoritas" 
      @click="navigateToTab('favoritas')"
      class="tab-favoritas"
    />
    <q-tab 
      name="escaladas" 
      label="Escaladas" 
      @click="navigateToTab('escaladas')"
      class="tab-escaladas"
    />
  </q-tabs>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

const activeTab = ref('escaladas');
const router = useRouter();

// Cores das ações conforme design system
const actionColors = {
  colecoes: '#546119', // $cumes-02 (action-colecoes)
  favoritas: '#F4E285', // $cumes-04 (action-favoritos)
  escaladas: '#F29340' // $cumes-03 (action-escaladas)
};

// Cor ativa baseada na rota atual
const activeColor = computed(() => {
  const path = router.currentRoute.value.path;
  if (path.includes('colecoes')) {
    return actionColors.colecoes;
  } else if (path.includes('favoritas')) {
    return actionColors.favoritas;
  } else if (path.includes('escaladas')) {
    return actionColors.escaladas;
  }
  return actionColors.escaladas; // Default
});

// Classe CSS dinâmica (não precisa mais, mas mantém para compatibilidade)
const tabsClass = computed(() => {
  return 'tabs-dynamic';
});

// Não precisa mais das flags, cada tab sempre tem sua classe

const navigateToTab = (tabName: string) => {
  activeTab.value = tabName;
  router.push(`/${tabName}`);
};

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath.includes('colecoes')) {
      activeTab.value = 'colecoes';
    } else if (newPath.includes('favoritas')) {
      activeTab.value = 'favoritas';
    } else if (newPath.includes('escaladas')) activeTab.value = 'escaladas';
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.text-white {
  color: white;
}

.q-tabs {
  margin-bottom: 8px;
  background-color: #373636 !important; /* Fundo cinza sempre */
  transition: all 0.3s ease;
}

// Estilos para cada tab individual
// Coleções - Verde escuro
:deep(.tab-colecoes.q-tab--active) {
  color: $action-colecoes !important;
}

:deep(.tab-colecoes:hover) {
  color: $action-colecoes !important;
}

// Favoritas - Amarelo
:deep(.tab-favoritas.q-tab--active) {
  color: $action-favoritos !important;
}

:deep(.tab-favoritas:hover) {
  color: $action-favoritos !important;
}

// Escaladas - Laranja
:deep(.tab-escaladas.q-tab--active) {
  color: $action-escaladas !important;
}

:deep(.tab-escaladas:hover) {
  color: $action-escaladas !important;
}

// Barra indicadora (usa active-color que já está sendo passado dinamicamente)
:deep(.q-tabs__content .q-tab__indicator) {
  height: 3px !important;
  border-radius: 2px 2px 0 0 !important;
}

// Tabs inativas
:deep(.q-tab:not(.q-tab--active)) {
  color: rgba(255, 255, 255, 0.7) !important;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9) !important;
  }
}
</style>
