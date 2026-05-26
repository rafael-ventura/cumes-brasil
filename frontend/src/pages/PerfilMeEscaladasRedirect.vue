<template>
  <q-page class="redirect-page flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';

defineOptions({ name: 'PerfilMeEscaladasRedirect' });

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    await UserService.getPerfil();
    await router.replace({ path: '/escaladas', query: route.query });
  } catch {
    await router.replace({ name: 'PerfilMe' });
  }
});
</script>

<style scoped>
.redirect-page {
  min-height: 40vh;
}
</style>
