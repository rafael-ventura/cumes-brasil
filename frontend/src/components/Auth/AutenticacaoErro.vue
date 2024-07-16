<template>
  <q-banner v-if="props.message"
            class="text-white bg-red"
            type="negative">
    {{ props.message }}
  </q-banner>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ message: string | null }>();
</script>
