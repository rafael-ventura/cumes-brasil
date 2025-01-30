<template>
  <div class="titulo-pagina">Catálogo de Vias</div>
  <q-page>
    <Busca
      ref="searchEntityRef"
      entity="via"
      @select="goViaDetalhadaView($event.id)"
      :enableSortOptions="[{ field: 'nome', label: 'Nome' }]"
      :hide-header="true"
    >
      <template #filters="{ filters }">
        <BuscaFiltros :entity="'via'" :filters="filters" @applyFilters="applyFilters" />
      </template>
    </Busca>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BuscaFiltros from 'components/Busca/BuscaFiltros.vue';
import Busca from 'components/Busca/Busca.vue';

const router = useRouter();
const searchEntityRef = ref();

defineOptions({
  name: 'ViasPage'
});

const applyFilters = (filters: any) => {
  if (searchEntityRef.value && searchEntityRef.value.handleApplyFilters) {
    searchEntityRef.value.handleApplyFilters(filters);
  } else {
    console.error('Busca ref not found or handleApplyFilters not defined');
  }
};

const goViaDetalhadaView = (id: number) => {
  router.push(`/vias/${id}`);
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.titulo-pagina {
  font-size: 40px;
  text-align: center;
  color: $cumes-03;
}
</style>
