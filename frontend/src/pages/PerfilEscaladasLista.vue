<template>
  <q-page class="perfil-escaladas-lista">
    <div class="perfil-escaladas-lista__hero">
      <BotaoVoltar class="perfil-escaladas-lista__back" />
      <div class="perfil-escaladas-lista__hero-inner">
        <div class="perfil-escaladas-lista__hero-icon">
          <i class="pi pi-users" aria-hidden="true" />
        </div>
        <h1 class="perfil-escaladas-lista__titulo">Álbum da cordada</h1>
        <p class="perfil-escaladas-lista__lead">
          <strong>{{ tituloNome }}</strong> — registros de outras pessoas em que foi incluído na cordada
          (guia, participante ou misto).
        </p>
        <p v-if="!carregando && !erro && escaladas.length" class="perfil-escaladas-lista__count">
          {{ escaladas.length }} {{ escaladas.length === 1 ? 'registro' : 'registros' }}
        </p>
      </div>
    </div>

    <div v-if="carregando" class="estado-centro">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-else-if="erro" class="estado-centro estado-erro">
      <q-icon name="person_off" size="48px" />
      <span>Não foi possível carregar este perfil.</span>
      <q-btn flat no-caps label="Voltar" class="btn-voltar" @click="router.push('/')" />
    </div>

    <div v-else-if="!escaladas.length" class="estado-centro">
      <span>Nenhuma marcação em registro de terceiros ainda.</span>
    </div>

    <div v-else class="perfil-escaladas-lista__lista">
      <PerfilMarcacaoEscaladaRow
        v-for="e in escaladas"
        :key="e.id"
        :escalada="e"
      />
    </div>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import PerfilMarcacaoEscaladaRow from 'components/Perfil/PerfilMarcacaoEscaladaRow.vue';
import EscaladaService from 'src/services/EscaladaService';
import UserService from 'src/services/UsuarioService';
import AuthenticateService from 'src/services/AuthenticateService';
import type { Escalada } from 'src/models/Escalada';

const route = useRoute();
const router = useRouter();

const carregando = ref(true);
const erro = ref(false);
const escaladas = ref<Escalada[]>([]);
const nomeExibicao = ref('');

const usernameParam = computed(() => String(route.params.username || ''));

const tituloNome = computed(() => {
  if (nomeExibicao.value) return nomeExibicao.value;
  return `@${usernameParam.value}`;
});

onMounted(async () => {
  if (!AuthenticateService.isTokenValid()) {
    router.replace({ path: '/auth/login', query: { redirect: route.fullPath } });
    return;
  }

  const u = usernameParam.value;
  if (!u) {
    erro.value = true;
    carregando.value = false;
    return;
  }

  try {
    const perfil = await UserService.getPerfilPorUsername(u.toLowerCase());
    if (!perfil || 'privado' in perfil) {
      erro.value = true;
      return;
    }
    nomeExibicao.value = perfil.nome || perfil.username || u;
    const lista = await EscaladaService.listarOndeFoiMarcado(perfil.id);
    escaladas.value = Array.isArray(lista) ? lista : [];
    escaladas.value.sort((a, b) => {
      const da = a.data ? new Date(a.data).getTime() : 0;
      const db = b.data ? new Date(b.data).getTime() : 0;
      return db - da;
    });
  } catch {
    erro.value = true;
  } finally {
    carregando.value = false;
  }
});

defineOptions({ name: 'PerfilEscaladasLista' });
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.perfil-escaladas-lista {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px 16px 32px;
}

.perfil-escaladas-lista__hero {
  position: relative;
  margin-bottom: 28px;
  border-radius: 18px;
  padding: 24px 20px 28px;
  background: linear-gradient(
    135deg,
    rgba($cumes-01, 0.28) 0%,
    rgba($background, 0.65) 48%,
    rgba($cumes-02, 0.2) 100%
  );
  border: 1px solid rgba($cumes-01, 0.35);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 0%, rgba($cumes-03, 0.12), transparent 55%);
    pointer-events: none;
  }
}

.perfil-escaladas-lista__back {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.perfil-escaladas-lista__hero-inner {
  position: relative;
  z-index: 1;
  padding: 36px 8px 0;
  text-align: center;

  @media (max-width: 600px) {
    padding-top: 44px;
  }
}

.perfil-escaladas-lista__hero-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($background, 0.35);
  border: 1px solid rgba($cumes-03, 0.35);
  color: $action-escaladas;
  font-size: 1.35rem;
}

.perfil-escaladas-lista__titulo {
  margin: 0;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 800;
  color: $cumes-01;
  letter-spacing: -0.03em;
}

.perfil-escaladas-lista__lead {
  margin: 12px auto 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba($offwhite, 0.52);
  font-weight: 500;
  max-width: 440px;
}

.perfil-escaladas-lista__count {
  margin: 14px 0 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba($cumes-03, 0.95);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.estado-centro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 36vh;
  color: rgba($offwhite, 0.55);
  font-weight: 600;
  text-align: center;
  padding: 0 16px;
}

.estado-erro {
  color: rgba($offwhite, 0.65);
}

.btn-voltar {
  color: $cumes-03 !important;
  font-weight: 700 !important;
}

.perfil-escaladas-lista__lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-bottom-spacer {
  height: 48px;
}
</style>
