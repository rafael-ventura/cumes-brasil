<template>
  <div class="via-list">
    <ViaCard v-for="via in props.vias" :key="via.id" :via="via" @click="showDetails(via)" />
    <q-dialog v-model="isModalOpen" @hide="closeModal" persistent>
      <ModalViaDetalhada :isOpen="isModalOpen" :via="<Via>selectedVia" @update:isOpen="isModalOpen = $event" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Via } from "src/models/Via";
import ViaCard from "components/Via/ViaCard.vue";
import ModalViaDetalhada from "components/Via/ModalViaDetalhada.vue";

const props = defineProps<{ vias: Via[] }>();

const isModalOpen = ref(false);
const selectedVia = ref<Via | null>(null);

const showDetails = (via: Via) => {
  selectedVia.value = via;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.via-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
