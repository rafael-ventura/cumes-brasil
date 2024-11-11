<template>
  <div>
    <div class="order-container">
      <div class="total-results" v-if="totalItems">
        {{ totalItems > 1 ? `${totalItems} resultados` : `${totalItems} resultado` }}
      </div>
      <q-select
        v-model="currentSortOption"
        :options="filteredSortOptions"
        option-value="value"
        option-label="label"
        label="Ordenar por"
        label-color="primary"
        class="q-select-custom"
        outlined
        rounded
        dense
        map-options
        @update:model-value="changeSorting"
      />
    </div>
    <!-- Renderiza ViaCard se entityType for 'via' -->
    <div v-if="entityType === 'via'">
      <ViaLista :vias="sortedResults as Via[]" />
    </div>
    <!-- Renderiza ColecaoCard se entityType for 'colecao' -->
    <div v-else-if="entityType === 'colecao'">
      <ColecaoLista :colecoes="sortedResults as IColecao[]" />
    </div>
    <div v-else-if="entityType === 'escalada'">
      <EscaladaCard
        v-for="escalada in sortedResults"
        :key="escalada.id"
        :escalada="escalada"
        class="escalada-card"
      />
    </div>
    <!-- Mensagem se não houver resultados -->
    <div v-if="results && results.length === 0">
      <p>No results found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue';
import ViaLista from 'components/Via/ViaLista.vue';
import ColecaoLista from 'components/Colecao/ColecaoLista.vue';
import { Via } from 'src/models/Via';
import { IColecao } from 'src/models/IColecao';
import EscaladaCard from 'components/Escalada/EscaladaCard.vue';
import { Escalada } from 'src/models/Escalada';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const props = defineProps<{
  results:(Via | IColecao | Escalada)[];
  entityType: 'via' | 'colecao' | 'escalada';
  totalItems?: number;
  initialSort?: { field: string, direction: 'asc' | 'desc' };
  enableSortOptions?: { field: string, label: string }[]; // Novo campo para customizar opções de ordenação
}>();

const emit = defineEmits(['select', 'change-sort']);

// Opções padrão de ordenação
const defaultSortOptions = ref([
  { label: 'Nome (A-Z)', value: { field: 'nome', direction: 'asc' } },
  { label: 'Nome (Z-A)', value: { field: 'nome', direction: 'desc' } },
  { label: 'Mais recente', value: { field: 'data_adicao', direction: 'desc' } },
  { label: 'Mais antiga', value: { field: 'data_adicao', direction: 'asc' } }
]);

// Filtrar as opções de ordenação com base na configuração do componente pai
const filteredSortOptions = computed(() => {
  if (!props.enableSortOptions) {
    // Se não houver configuração de opções, usar todas as opções padrão
    return defaultSortOptions.value;
  }

  // Filtrar as opções com base nas permitidas pelo componente pai
  return defaultSortOptions.value.filter(option =>
    props.enableSortOptions?.some(sortOption => sortOption.field === option.value.field)
  );
});

// Ordenação atual
const currentSortOption = ref(
  props.initialSort ? props.initialSort : filteredSortOptions.value[0]?.value
);

// Aplica a ordenação nos resultados
const sortedResults: any = computed(() => {
  if (!props.results || !props.results.length) return [];

  // Copia os resultados para não alterar a prop original
  const resultsCopy = [...props.results];

  if (!currentSortOption.value) return resultsCopy;
  return resultsCopy.sort((a: any, b: any) => {
    const field = currentSortOption.value.field;
    const direction = currentSortOption.value.direction;

    // Ordenação por nome
    if (field === 'nome' && a.nome && b.nome) {
      return direction === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }

    // Ordenação por data de adição
    if (field === 'data_adicao') {
      console.log(a, b);
      const dateA = new Date(a.data_adicao || '');
      const dateB = new Date(b.data_adicao || '');

      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
});

// Atualiza a ordenação quando o usuário muda a opção de ordenação
const changeSorting = (sortOption: any) => {
  currentSortOption.value = sortOption.value;
  emit('change-sort', { field: sortOption.value.field, direction: sortOption.value.direction });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const selectItem = (item: Via | IColecao | any) => {
  emit('select', item);
};
</script>

<style scoped>
.order-container {
  margin-bottom: 16px;
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;
}

.order-container .q-field__label {
  color: #fcbd7b !important; /* Define a cor da label */
}

.via-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.escalada-card {
  width: 100%;
  margin-bottom: 10%;
  border-radius: 11px;
  padding: 0;
}

.escalada-card img {
  width: 100%;
  height: auto;
  padding: 0; /* Remove padding da imagem */
  margin: 0; /* Remove margin da imagem */
  border: 0; /* Remove borda da imagem */
  border-top-left-radius: 10px; /* Borda arredondada superior esquerda */
  border-top-right-radius: 10px; /* Borda arredondada superior direita */
  object-fit: cover; /* Garante que a imagem se ajuste corretamente ao espaço */
}

.total-results {
  color: #fcbd7b; /* Tom de amarelo */
  font-size: 13px; /* Tamanho pequeno */
  margin-right: auto; /* Move the total results to the far left */
  margin-top: auto; /* Espaçamento superior */
  margin-left: 16px; /* Espaçamento à esquerda */
}

.q-select-custom {
  width: 40%;
}
</style>
