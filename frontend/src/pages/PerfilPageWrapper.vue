<template>
  <div v-if="resolvendo">
    <div class="perfil-estado">
      <i class="pi pi-spin pi-spinner" />
      <span>Carregando...</span>
    </div>
  </div>

  <Perfil v-else-if="eProprioPerfil && usuario" :user-inicial="usuario" />
  <PerfilPublico v-else-if="usuario" :user="usuario" />
  <div v-else-if="privado" class="perfil-estado perfil-privado">
    <i class="pi pi-lock" />
    <span class="privado-titulo">Perfil privado</span>
    <span class="privado-sub">Este escalador preferiu manter seu perfil privado.</span>
    <q-btn unelevated no-caps label="Voltar" class="btn-voltar" @click="router.back()" />
  </div>
  <div v-else-if="erro" class="perfil-estado">
    <i class="pi pi-user-minus" />
    <span>Perfil não encontrado</span>
    <q-btn flat no-caps label="Voltar" class="btn-voltar" @click="router.push('/')" />
  </div>
  <div v-else class="perfil-estado">
    <i class="pi pi-user-minus" />
    <span>Perfil não encontrado</span>
    <q-btn flat no-caps label="Voltar" class="btn-voltar" @click="router.push('/')" />
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
const privado = ref(false);
const erro = ref(false);

const usernameParam = computed(() => route.params.username as string);
const eProprioPerfil = computed(() => {
  if (!AuthenticateService.isTokenValid()) return false;
  const idAtual = localStorage.getItem('usuarioId');
  return !!idAtual && !!usuario.value && String(usuario.value.id) === idAtual;
});

async function resolverPerfil() {
  if (!AuthenticateService.isTokenValid()) {
    router.replace('/auth/login');
    return;
  }

  usuario.value = null;
  privado.value = false;
  erro.value = false;
  resolvendo.value = true;

  const username = usernameParam.value;
  if (!username) {
    resolvendo.value = false;
    erro.value = true;
    return;
  }

  if (username === 'me') {
    try {
      const perfil = await UserService.getPerfil();
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

  // Se é o próprio username, busca perfil autenticado completo
  const usernameLogado = localStorage.getItem('username');
  if (AuthenticateService.isTokenValid() && usernameLogado && username === usernameLogado) {
    try {
      const perfil = await UserService.getPerfil();
      usuario.value = perfil;
    } catch {
      erro.value = true;
    } finally {
      resolvendo.value = false;
    }
    return;
  }

  try {
    const dados = await UserService.getPerfilPorUsername(username);
    if (!dados) {
      erro.value = true;
    } else if ('privado' in dados) {
      privado.value = true;
    } else {
      usuario.value = dados;
    }
  } catch {
    erro.value = true;
  } finally {
    resolvendo.value = false;
  }
}

watch(() => route.params.username, () => {
  resolverPerfil();
}, { immediate: false });

onMounted(resolverPerfil);
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.perfil-estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 50vh;
  color: rgba($offwhite, 0.6);
  font-size: 16px;
  font-weight: 600;

  i {
    font-size: 56px;
    color: $cumes-03;
  }
}

.perfil-privado {
  i { color: $cumes-04; }
}

.privado-titulo {
  font-size: 22px;
  font-weight: 800;
  color: $cumes-04;
}

.privado-sub {
  font-size: 14px;
  color: rgba($offwhite, 0.45);
  font-weight: 400;
  text-align: center;
  max-width: 280px;
}

.btn-voltar {
  background: $cumes-01 !important;
  color: $offwhite !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  padding: 8px 24px !important;
  margin-top: 8px;
}
</style>
