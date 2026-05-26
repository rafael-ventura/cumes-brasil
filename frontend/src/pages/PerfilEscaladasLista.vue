<template>
  <q-page class="perfil-escaladas-lista">
    <div class="perfil-escaladas-lista__hero">
      <BotaoVoltar class="perfil-escaladas-lista__back" />
      <div class="perfil-escaladas-lista__hero-inner">
        <div class="perfil-escaladas-lista__hero-icon">
          <i class="pi pi-flag" aria-hidden="true" />
        </div>
        <h1 class="perfil-escaladas-lista__titulo">Escaladas e participações</h1>
        <p class="perfil-escaladas-lista__lead">
          <strong>{{ tituloNome }}</strong> — {{" "}}
          <span v-if="filtro === 'todas'">visão completa de atividades</span>
          <span v-else-if="filtro === 'autor'">registros criados por você</span>
          <span v-else>registros em que você foi marcado por outras pessoas</span>
          <span class="perfil-escaladas-lista__lead-muted">.</span>
        </p>

        <div class="perfil-escaladas-lista__filtros">
          <div class="perfil-escaladas-lista__tabs">
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtro === 'todas' }"
              @click="aoAlterarFiltro('todas')"
            >
              <i class="pi pi-th-large filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Todas</span>
              <span class="filtro-pill__count">{{ totalTodas }}</span>
            </button>
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtro === 'autor' }"
              @click="aoAlterarFiltro('autor')"
            >
              <i class="pi pi-pencil filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Por mim</span>
              <span class="filtro-pill__count">{{ totalAutor }}</span>
            </button>
            <button
              type="button"
              class="filtro-pill"
              :class="{ ativo: filtro === 'marcado' }"
              @click="aoAlterarFiltro('marcado')"
            >
              <i class="pi pi-user-plus filtro-pill__icone" aria-hidden="true" />
              <span class="filtro-pill__titulo">Me marcaram</span>
              <span class="filtro-pill__count">{{ totalMarcado }}</span>
            </button>
          </div>
        </div>
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
      <span v-if="filtro === 'autor'">Você ainda não registrou escaladas.</span>
      <span v-else-if="filtro === 'marcado'">Nenhum registro de terceiros ainda.</span>
      <span v-else>Nenhuma escalada por enquanto.</span>
    </div>

    <div v-else class="perfil-escaladas-lista__grid">
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
const totalAutor = ref(0);
const totalMarcado = ref(0);
const totalTodas = ref(0);

type FiltroEscaladas = 'todas' | 'autor' | 'marcado';
const filtro = ref<FiltroEscaladas>('todas');

const usernameParam = computed(() => String(route.params.username || ''));

const tituloNome = computed(() => {
  if (nomeExibicao.value) return nomeExibicao.value;
  return `@${usernameParam.value}`;
});

function normalizarFiltro (raw: unknown): FiltroEscaladas {
  const str = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  if (str === 'autor') return 'autor';
  if (str === 'marcado') return 'marcado';
  return 'todas';
}

async function carregar () {
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
    erro.value = false;
    carregando.value = true;

    const perfil = await UserService.getPerfilPorUsername(u.toLowerCase());
    if (!perfil || 'privado' in perfil) {
      erro.value = true;
      return;
    }
    nomeExibicao.value = perfil.nome || perfil.username || u;

    const filtroAtual = filtro.value;
    const [autorLista, marcadoLista] = await Promise.all([
      EscaladaService.listarPorUsuarioId(perfil.id, 'autor'),
      EscaladaService.listarOndeFoiMarcado(perfil.id)
    ]);

    totalAutor.value = (autorLista ?? []).length;
    totalMarcado.value = (marcadoLista ?? []).length;
    totalTodas.value = new Set<number>([
      ...(autorLista ?? []).map(e => e.id),
      ...(marcadoLista ?? []).map(e => e.id)
    ]).size;

    if (filtroAtual === 'autor') {
      escaladas.value = Array.isArray(autorLista) ? autorLista : [];
    } else if (filtroAtual === 'marcado') {
      escaladas.value = Array.isArray(marcadoLista) ? marcadoLista : [];
    } else {
      const mapa = new Map<number, Escalada>();
      for (const e of (autorLista ?? [])) mapa.set(e.id, e);
      for (const e of (marcadoLista ?? [])) mapa.set(e.id, e);
      escaladas.value = Array.from(mapa.values());
    }

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
}

async function aoAlterarFiltro (novoFiltro: FiltroEscaladas) {
  if (filtro.value === novoFiltro) return;
  filtro.value = novoFiltro;
  await router.replace({ query: { ...route.query, filtro: novoFiltro } });
  await carregar();
}

onMounted(async () => {
  filtro.value = normalizarFiltro(route.query.filtro);
  await carregar();
});

defineOptions({ name: 'PerfilEscaladasLista' });
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.perfil-escaladas-lista {
  max-width: 1040px;
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

.perfil-escaladas-lista__lead-muted {
  color: rgba($offwhite, 0.45);
  font-weight: 500;
}

.perfil-escaladas-lista__filtros {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

.perfil-escaladas-lista__tabs {
  width: 100%;
  max-width: 760px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.filtro-pill {
  border: 1px solid rgba($offwhite, 0.12);
  background: rgba($offwhite, 0.03);
  border-radius: 12px;
  color: rgba($offwhite, 0.85);
  min-height: 54px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba($cumes-03, 0.45);
    background: rgba($offwhite, 0.06);
  }

  &.ativo {
    border-color: rgba($cumes-03, 0.68);
    background: rgba($cumes-03, 0.12);
    box-shadow: 0 4px 16px rgba($cumes-03, 0.18);
    color: $offwhite;
  }

  &:nth-child(1).ativo {
    border-color: rgba($cumes-03, 0.75);
    background: rgba($cumes-03, 0.14);
  }

  &:nth-child(2).ativo {
    border-color: rgba($cumes-01, 0.78);
    background: rgba($cumes-01, 0.14);
  }

  &:nth-child(3).ativo {
    border-color: rgba($action-escaladas, 0.8);
    background: rgba($action-escaladas, 0.14);
  }
}

.filtro-pill__icone {
  font-size: 14px;
  opacity: 0.8;
}

.filtro-pill__titulo {
  font-size: 12px;
  font-weight: 700;
}

.filtro-pill__count {
  font-size: 11px;
  color: rgba($offwhite, 0.55);
  font-weight: 700;
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

.perfil-escaladas-lista__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.page-bottom-spacer {
  height: 48px;
}
</style>
