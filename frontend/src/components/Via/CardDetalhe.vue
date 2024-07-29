<template>
  <q-card class="q-ma-md bg-grey-3 rounded-borders">
    <q-card-section class="card-content">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}
</style>
