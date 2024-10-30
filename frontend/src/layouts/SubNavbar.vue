<template>
  <q-tabs
    v-model="activeTab"
    class="text-h6 text-white"
    active-color="primary"
    align="justify"
    dense
  >
    <q-tab name="colecoes" label="Coleções" @click="navigateToTab('colecoes')" />
    <q-tab name="favoritas" label="Favoritas" @click="navigateToTab('favoritas')" />
    <q-tab name="escaladas" label="Escaladas" @click="navigateToTab('escaladas')" />
  </q-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const activeTab = ref('escaladas');
const router = useRouter();

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

<style scoped>
.text-white {
  color: white;
}

.q-tabs {
  margin-bottom: 8px;
}
</style>
