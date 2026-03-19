<template>
  <div v-if="resolvendo">
    <div class="perfil-carregando">
      <i class="pi pi-spin pi-spinner" />
      <span>Carregando...</span>
    </div>
  </div>
  <Perfil v-else-if="eProprioPerfil && usuario" :user-inicial="usuario" />
  <PerfilPublico v-else-if="usuario" :user="usuario" />
  <div v-else-if="erro" class="perfil-erro">
    <i class="pi pi-user-minus" />
    <span>Perfil não encontrado</span>
    <q-btn flat label="Voltar" class="btn-voltar" @click="router.push('/')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Perfil from 'pages/Perfil.vue';
import PerfilPublico from 'pages/PerfilPublico.vue';
import UserService from 'src/services/UsuarioService';
import AuthenticateService from 'src/services/AuthenticateService';
import { IUsuario } from 'src/models/IUsuario';

const route = useRoute();
const router = useRouter();

const usuario = ref<(IUsuario & { username?: string }) | null>(null);
const resolvendo = ref(true);
const erro = ref(false);

const usernameParam = computed(() => route.params.username as string);
const eProprioPerfil = computed(() => {
  if (!AuthenticateService.isTokenValid()) return false;
  const idAtual = localStorage.getItem('usuarioId');
  return !!idAtual && !!usuario.value && String(usuario.value.id) === idAtual;
});

async function resolverPerfil() {
  const username = usernameParam.value;
  if (!username) {
    resolvendo.value = false;
    erro.value = true;
    return;
  }

  if (username === 'me') {
    if (!AuthenticateService.isTokenValid()) {
      router.replace('/auth/login');
      return;
    }
    try {
      const perfil = await UserService.getPerfil();
      // Sincroniza username no localStorage caso sessão seja antiga
      if (perfil.username && !localStorage.getItem('username')) {
        localStorage.setItem('username', perfil.username);
      }
      usuario.value = perfil;
      resolvendo.value = false;
      if (perfil.username) {
        router.replace({ path: `/perfil/${perfil.username}` });
      }
      return;
    } catch {
      resolvendo.value = false;
      erro.value = true;
      return;
    }
  }

  try {
    const dados = await UserService.getPerfilPorUsername(username);
    usuario.value = dados ?? null;
    erro.value = !dados;
  } catch {
    usuario.value = null;
    erro.value = true;
  } finally {
    resolvendo.value = false;
  }
}

watch(() => route.params.username, () => {
  if (route.params.username !== 'me') {
    resolvendo.value = true;
    resolverPerfil();
  }
}, { immediate: false });

onMounted(resolverPerfil);
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.perfil-carregando,
.perfil-erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 40vh;
  color: rgba($offwhite, 0.6);
  font-size: 16px;
  font-weight: 600;

  i {
    font-size: 48px;
    color: $cumes-03;
  }
}

.btn-voltar {
  color: $cumes-01;
  margin-top: 8px;
}
</style>
