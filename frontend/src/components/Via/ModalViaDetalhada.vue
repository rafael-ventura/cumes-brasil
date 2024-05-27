<template>
  <q-dialog :model-value="isOpen" @hide="closeModal">
    <q-card class="modal-card">
      <BotaoFechar @close="closeModal"/>
      <q-card-section>
        <div class="text-h6">{{ via.nome }}</div>
        <div class="text-subtitle2">{{ via.montanha.nome }}</div>
      </q-card-section>
      <q-card-section>
        <p><strong>Grau:</strong> {{ grauConcatenado }}</p>
        <p><strong>Extensão:</strong> {{ via.extensao }}m</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Ver Detalhes" @click="goToDetails"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Via } from "src/models/Via";
import BotaoFechar from "components/BotaoFechar.vue";

const props = defineProps<{ isOpen: boolean, via: Via }>();
const emits = defineEmits(["update:isOpen"]);

const router = useRouter();

const closeModal = () => {
  emits("update:isOpen", false);
};

const goToDetails = () => {
  closeModal();
  router.push(`/vias/${props.via.id}`);
};

const grauConcatenado = computed(() => {
  const { grau, crux, artificial, duracao, exposicao } = props.via;
  return [grau, crux, artificial, duracao, exposicao].filter(Boolean).join(", ");
});
</script>

<style scoped>
.modal-card {
  max-width: 90vw;
  max-height: 90vh;
  margin: auto;
}
</style>
