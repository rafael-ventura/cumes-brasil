<template>
  <div>
    <div class="via-list">
      <!-- Renderiza ViaCard se entityType for 'via' -->
      <div v-if="props.entityType === 'via'">
        <ViaLista :vias="results as Via[]" />
      </div>
      <!-- Renderiza ColecaoCard se entityType for 'colecao' -->
      <div class="via-list" v-else-if="props.entityType === 'colecao'">
        <ColecaoCard
          v-for="item in results as Colecao[]"
          :key="item.id + 'colecao'"
          :colecao="item"
          @click-item="selectItem"
          :via="item.vias ? item.vias[0] : null"
        />
      </div>
      <!-- Mensagem se não houver resultados -->
      <div v-if="!props.results || props.results.length === 0">
        <p>No results found.</p>
      </div>
    </div>
    <!-- Exibe a quantidade total de itens -->
    <div v-if="props.totalItems !== undefined">
      <p>Total Items Found: {{ props.totalItems }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import ColecaoCard from "components/Colecao/ColecaoCard.vue";
import { Via } from "src/models/Via";
import { Colecao } from "src/models/Colecao";
import ViaLista from "components/Via/ViaLista.vue";

// Props
const props = defineProps<{
  results:(Via | Colecao)[];
  entityType: "via" | "colecao";
  totalItems?: number;
}>();

const emit = defineEmits(["select"]);

const selectItem = (item: Via | Colecao) => {
  emit("select", item);
};
</script>

<style scoped>
.via-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
