<template>
  <q-page>
    <SearchEntity
      ref="searchEntityRef"
      entity="via"
      @select="goViaDetalhadaView($event.id)"
    >
      <template #filters="{ filters }">
        <SearchFilters :filters="filters" :enabledFilters="['searchQuery', 'selectedMountain', 'selectedDifficulty']" @applyFilters="applyFilters" />
      </template>
    </SearchEntity>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchFilters from 'components/Busca/SearchFilters.vue';
import SearchEntity from 'components/Busca/SearchEntity.vue';

const router = useRouter();
const searchEntityRef = ref();

defineOptions({
  name: 'ViasPage'
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('SearchEntity ref not found or handleApplyFilters not defined');
  }
};

const goViaDetalhadaView = (id: number) => {
  router.push(`/vias/${id}`);
};
</script>
