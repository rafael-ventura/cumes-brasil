<!-- src/views/ViasView2.vue -->

<template>
  <div>
    <h2>Vias</h2>
    <ul>
      <li v-for="via in vias" :key="via.id">
        {{ via.nome }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { ViaService } from "../services/viaService";

export default defineComponent({
  name: "ViasView2",
  setup () {
    const vias = ref<any[]>([]);
    const viaService = new ViaService();

    // Carregar as vias ao montar o componente
    onMounted(async () => {
      try {
        vias.value = await viaService.getAllVias();
      } catch (error) {
        console.error(error);
      }
    });

    return {
      vias
    };
  }
});
</script>
