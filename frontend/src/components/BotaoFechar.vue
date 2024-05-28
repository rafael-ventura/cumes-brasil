<template>
  <q-btn
    flat
    round
    icon="close"
    class="close-button"
    @click="emitClose"
  />
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emits = defineEmits(["close"]);

const emitClose = () => {
  emits("close");
};
</script>

<style scoped>
.close-button:hover {
  background-color: darkred;
}
</style>
