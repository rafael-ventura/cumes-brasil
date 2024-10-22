<template>
  <div>
    <div class="order-container">
      <q-select
        v-model="currentSortOption"
        :options="sortOptions"
        label="Ordenar por"
        option-label="label"
        outlined
        dense
        @update:model-value="applySorting"
      />
    </div>
    <!-- Renderiza ViaCard se entityType for 'via' -->
    <div v-if="entityType === 'via'">
      <ViaLista :vias="sortedResults as Via[]" />
    </div>
    <!-- Renderiza ColecaoCard se entityType for 'colecao' -->
    <div v-else-if="entityType === 'colecao'">
      <ColecaoLista :colecoes="sortedResults as Colecao[]" />
    </div>
    <!-- Mensagem se não houver resultados -->
    <div v-if="results && results.length === 0">
      <p>No results found.</p>
    </div>
    <!-- Exibe a quantidade total de itens -->
    <div v-if="totalItems !== undefined">
      <p>Total Items Found: {{ totalItems }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import ViaLista from 'components/Via/ViaLista.vue';
import ColecaoLista from 'components/Colecao/ColecaoLista.vue';
import { Via } from 'src/models/Via';
import { Colecao } from 'src/models/Colecao';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const props = defineProps<{
  results:(Via | Colecao)[];
  entityType: 'via' | 'colecao';
  totalItems?: number;
  initialSort?: { field: string, direction: 'asc' | 'desc' };
}>();

const emit = defineEmits(['select']);

// Opções de ordenação
const sortOptions = ref([
  { label: 'Nome (A-Z)', value: { field: 'nome', direction: 'asc' } },
  { label: 'Nome (Z-A)', value: { field: 'nome', direction: 'desc' } },
  { label: 'Data de Adição (Mais recente)', value: { field: 'data_adicao', direction: 'desc' } },
  { label: 'Data de Adição (Mais antiga)', value: { field: 'data_adicao', direction: 'asc' } }
]);

// Ordenação atual
const currentSortOption = ref(props.initialSort || { field: 'nome', direction: 'asc' });

// Aplica a ordenação nos resultados
const sortedResults = computed(() => {
  if (!props.results || !props.results.length) return [];

  // Copia os resultados para não alterar a prop original
  const resultsCopy = [...props.results];

  return resultsCopy.sort((a: any, b: any) => {
    const field = currentSortOption.value.field;
    const direction = currentSortOption.value.direction;

    // Ordenação por nome
    if (field === 'nome') {
      return direction === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }

    // Ordenação por data de adição
    if (field === 'data_adicao') {
      const dateA = new Date(a.data_adicao || '');
      const dateB = new Date(b.data_adicao || '');

      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
});

// Aplica a nova ordenação
const applySorting = (sortOption: any) => {
  currentSortOption.value = sortOption.value;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const selectItem = (item: Via | Colecao) => {
  emit('select', item);
};
</script>

<style scoped>
.order-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.via-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
