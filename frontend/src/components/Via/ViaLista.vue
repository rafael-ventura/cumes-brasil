<template>
  <div class="via-list">
    <ViaCard v-for="via in props.vias" :key="via.id" :via="via" @click="showDetails(via)" />
  </div>
</template>

<script setup lang="ts">
import { Via } from "src/models/Via";
import ViaCard from "components/Via/ViaCard.vue";
import { useRouter } from "vue-router";

const props = defineProps<{ vias: Via[] }>();
const router = useRouter();

const showDetails = (via: Via) => {
  router.push(`/vias/${via.id}`);
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
