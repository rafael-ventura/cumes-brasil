<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Suas Coleções</div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import AuthenticateService from "../services/authenticateService";

const router = useRouter();

defineOptions({
  name: "ColecoesPage"
});

onMounted(() => {
  if (!AuthenticateService.isAuthenticated()) {
    router.push("/login");
  }
});

</script>
