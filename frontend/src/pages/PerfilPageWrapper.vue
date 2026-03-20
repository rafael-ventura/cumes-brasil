<template>
  <div v-if="resolvendo">
    <div class="perfil-estado">
      <i class="pi pi-spin pi-spinner" />
      <span>Carregando...</span>
    </div>
  </div>

  <Perfil
    v-else-if="eProprioPerfil && usuario"
    :key="chaveRotaPerfil"
    :user-inicial="usuario"
  />
  <PerfilPublico
    v-else-if="usuario"
    :key="chaveRotaPerfil"
    :user="usuario"
  />
  <div v-else-if="privado" class="perfil-estado perfil-privado">
    <i class="pi pi-lock" />
    <span class="privado-titulo">Perfil privado</span>
    <span class="privado-sub">Este escalador preferiu manter seu perfil privado.</span>
    <span v-if="!estaLogado" class="privado-sub">Entre na sua conta para ver o seu próprio perfil.</span>
    <div class="row q-gutter-sm">
      <q-btn unelevated no-caps label="Voltar" class="btn-voltar" @click="router.back()" />
      <q-btn v-if="!estaLogado" flat no-caps label="Entrar" class="btn-secundario" :to="{ path: '/auth/login' }" />
    </div>
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
import { ref, computed, watch } from 'vue';
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

/** Username da rota (string única; evita bug com params como array). */
const usernameParam = computed(() => {
  const raw = route.params.username;
  const s = Array.isArray(raw) ? raw[0] : raw;
  return typeof s === 'string' ? s.trim() : '';
});

/** Força remount ao trocar de usuário na mesma rota (evita estado velho). */
const chaveRotaPerfil = computed(() => usernameParam.value || 'me');

const eProprioPerfil = computed(() => {
  if (!AuthenticateService.isTokenValid()) return false;
  const idAtual = localStorage.getItem('usuarioId');
  return !!idAtual && !!usuario.value && String(usuario.value.id) === idAtual;
});

const estaLogado = computed(() => AuthenticateService.isTokenValid());

async function resolverPerfil () {
  usuario.value = null;
  privado.value = false;
  erro.value = false;
  resolvendo.value = true;

  const usernameRaw = usernameParam.value;
  if (!usernameRaw) {
    resolvendo.value = false;
    erro.value = true;
    if (import.meta.env.DEV) {
      console.warn('[PerfilPageWrapper] username vazio na rota', route.fullPath);
    }
    return;
  }

  const username = usernameRaw.toLowerCase();
  const logado = AuthenticateService.isTokenValid();

  if (import.meta.env.DEV) {
    console.debug('[PerfilPageWrapper] resolver', { username, logado, path: route.fullPath });
  }

  if (usernameRaw === 'me') {
    if (!logado) {
      router.replace('/auth/login');
      return;
    }
    try {
      const perfil = await UserService.getPerfil();
      if (!perfil) {
        erro.value = true;
        if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfil retornou vazio');
      } else {
        if (perfil.username && !localStorage.getItem('username')) {
          localStorage.setItem('username', perfil.username);
        }
        usuario.value = perfil;
        if (perfil.username) {
          router.replace({ path: `/perfil/${perfil.username}` });
        }
      }
    } catch (e) {
      erro.value = true;
      if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfil falhou', e);
    } finally {
      resolvendo.value = false;
    }
    return;
  }

  // Visitante sem login: apenas perfis públicos via GET /u/:username
  if (!logado) {
    try {
      const dados = await UserService.getPerfilPorUsername(username);
      if (!dados) {
        erro.value = true;
      } else if ('privado' in dados) {
        privado.value = true;
      } else {
        usuario.value = dados;
      }
    } catch (e) {
      erro.value = true;
      if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfilPorUsername (anon)', e);
    } finally {
      resolvendo.value = false;
    }
    return;
  }

  // Logado: mesmo username que a sessão → /perfil com dados completos
  const usernameLogado = (localStorage.getItem('username') || '').toLowerCase();
  if (usernameLogado && username === usernameLogado) {
    try {
      const perfil = await UserService.getPerfil();
      if (!perfil) {
        erro.value = true;
        if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfil (próprio) vazio');
      } else {
        usuario.value = perfil;
      }
    } catch (e) {
      erro.value = true;
      if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfil (próprio) erro', e);
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
      const meuId = localStorage.getItem('usuarioId');
      const idAlvo = (dados as { id?: number }).id;
      /* Conta própria sem `username` no localStorage: público DTO → perfil completo */
      if (
        logado &&
        meuId &&
        idAlvo != null &&
        String(idAlvo) === String(meuId)
      ) {
        const perfil = await UserService.getPerfil();
        usuario.value = perfil ?? (dados as IUsuario & { username?: string });
        if (usuario.value?.username) {
          localStorage.setItem('username', usuario.value.username);
        }
      } else {
        usuario.value = dados as IUsuario & { username?: string };
      }
    }
  } catch (e) {
    erro.value = true;
    if (import.meta.env.DEV) console.warn('[PerfilPageWrapper] getPerfilPorUsername (visitante logado)', e);
  } finally {
    resolvendo.value = false;
  }
}

watch(
  () => [route.name, usernameParam.value] as const,
  () => {
    resolverPerfil();
  },
  { immediate: true }
);
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

.btn-secundario {
  color: $cumes-03 !important;
  font-weight: 600 !important;
}
</style>
