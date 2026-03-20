<template>
  <q-page class="redirect-page flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';

defineOptions({ name: 'PerfilMeEscaladasRedirect' });

const router = useRouter();

onMounted(async () => {
  try {
    const perfil = await UserService.getPerfil();
    if (perfil?.username) {
      await router.replace({ name: 'PerfilEscaladas', params: { username: perfil.username } });
    } else {
      await router.replace({ name: 'PerfilMe' });
    }
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
