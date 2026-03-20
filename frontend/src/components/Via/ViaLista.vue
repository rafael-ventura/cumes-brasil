<template>
  <div class="via-list">
    <ViaCard
      v-for="via in props.vias"
      :key="via.id"
      :via="via"
      :modo-selecao="modoSelecao"
      :selecionada="idsSelecionados.includes(via.id)"
      @toggle-selecao="emit('toggle-selecao', via.id)"
      @click="showDetails(via)"
    />
  </div>
</template>

<script setup lang="ts">
import { Via } from 'src/models/Via';
import ViaCard from 'components/Via/ViaCard.vue';
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    vias: Via[];
    modoSelecao?: boolean;
    idsSelecionados?: number[];
  }>(),
  { modoSelecao: false, idsSelecionados: () => [] }
);

const emit = defineEmits<{ 'toggle-selecao': [viaId: number] }>();
const router = useRouter();

const showDetails = (via: Via) => {
  if (props.modoSelecao) return;
  router.push(`/vias/${via.id}`);
};

</script>

<style scoped lang="scss">
@import 'src/css/app.scss';
.via-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
