<template>
  <section class="cordada-strip">
    <div class="cordada-strip__top">
      <div class="cordada-strip__label">
        <i class="pi pi-users cordada-strip__ico" aria-hidden="true" />
        <div class="cordada-strip__titles">
          <span class="cordada-strip__titulo">Na cordada</span>
          <span v-if="total > 0 && !precisaLogin" class="cordada-strip__badge">{{ total }}</span>
        </div>
      </div>
      <q-btn
        v-if="podeVerLista && total > 0"
        flat
        dense
        no-caps
        class="cordada-strip__link"
        :to="linkVerTodas"
      >
        Ver lista
        <i class="pi pi-angle-right" style="margin-left: 2px; font-size: 0.85em" />
      </q-btn>
    </div>

    <p v-if="!precisaLogin" class="cordada-strip__hint">
      {{ textoSubtitulo }}
    </p>

    <div v-if="precisaLogin" class="cordada-strip__anon">
      <q-icon name="lock" size="18px" />
      <span>Incluído em registros de outros (guia, participante ou misto). <strong>Entre</strong> para ver.</span>
      <q-btn flat dense no-caps class="cordada-strip__login" :to="{ path: '/auth/login' }">
        Entrar
      </q-btn>
    </div>

    <div v-else-if="carregando" class="cordada-strip__loading">
      <q-spinner color="primary" size="22px" />
    </div>

    <div v-else-if="!total" class="cordada-strip__vazio">
      <span v-if="modoProprio">Ainda sem marcações na cordada.</span>
      <span v-else>Nenhuma marcação pública ainda.</span>
    </div>

    <div v-else class="cordada-strip__scroll-wrap">
      <div class="cordada-strip__scroll">
        <router-link
          v-for="esc in previewsOrdenadas"
          :key="esc.id"
          class="cordada-strip__bubble"
          :title="tituloBolha(esc)"
          :to="{ name: 'EscaladaDetalhada', params: { id: String(esc.id) } }"
        >
          <img
            v-if="urlThumb(esc)"
            :src="urlThumb(esc)!"
            alt=""
            class="cordada-strip__bubble-img"
          />
          <div v-else class="cordada-strip__bubble-ph">
            <q-icon name="terrain" size="20px" />
          </div>
        </router-link>
        <router-link
          v-if="total > previewsOrdenadas.length"
          class="cordada-strip__bubble cordada-strip__bubble--mais"
          :to="linkVerTodas"
        >
          +{{ total - previewsOrdenadas.length }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import AuthenticateService from 'src/services/AuthenticateService';
import { getViaImageUrlFull } from 'src/utils/utils';
import type { Escalada } from 'src/models/Escalada';
import type { Via } from 'src/models/Via';

const props = withDefaults(
  defineProps<{
    usuarioId: number;
    username?: string;
    modoProprio: boolean;
    numEscaladasConhecido?: number | null;
  }>(),
  { username: '', numEscaladasConhecido: undefined }
);

const MAX_THUMB = 8;

const carregando = ref(true);
const lista = ref<Escalada[]>([]);

const logado = computed(() => AuthenticateService.isTokenValid());

const precisaLogin = computed(() => !props.modoProprio && !logado.value);

const podeVerLista = computed(() => props.modoProprio || logado.value);

const total = computed(() => {
  if (typeof props.numEscaladasConhecido === 'number') {
    return props.numEscaladasConhecido;
  }
  return lista.value.length;
});

const linkVerTodas = computed((): RouteLocationRaw => {
  if (props.modoProprio && props.username) {
    return { name: 'PerfilEscaladas', params: { username: props.username } };
  }
  if (props.modoProprio) {
    return { path: '/perfil/me/escaladas' };
  }
  if (props.username) {
    return { name: 'PerfilEscaladas', params: { username: props.username } };
  }
  return { path: '/perfil/me' };
});

const textoSubtitulo = computed(() => {
  if (!total.value) {
    return props.modoProprio
      ? 'Quando alguém registrar uma escalada e marcar você, um atalho aparece aqui.'
      : 'Registros em que esta pessoa foi citada na cordada.';
  }
  return 'Toque para abrir o registro.';
});

const previewsOrdenadas = computed(() => {
  const copia = [...lista.value];
  copia.sort((a, b) => {
    const da = a.data ? new Date(a.data).getTime() : 0;
    const db = b.data ? new Date(b.data).getTime() : 0;
    return db - da;
  });
  return copia.slice(0, MAX_THUMB);
});

function urlThumb (esc: Escalada): string | null {
  const via = esc.via as Via | undefined;
  if (!via || typeof via !== 'object') return null;
  return getViaImageUrlFull(via);
}

function tituloBolha (esc: Escalada): string {
  const v = esc.via as Via | undefined;
  const nome = v && typeof v === 'object' && v.nome ? v.nome : 'Escalada';
  return nome;
}

async function carregar () {
  if (precisaLogin.value) {
    carregando.value = false;
    lista.value = [];
    return;
  }
  if (typeof props.numEscaladasConhecido === 'number' && props.numEscaladasConhecido === 0) {
    lista.value = [];
    carregando.value = false;
    return;
  }
  carregando.value = true;
  try {
    const dados = await EscaladaService.listarOndeFoiMarcado(props.usuarioId);
    lista.value = Array.isArray(dados) ? dados : [];
  } catch {
    lista.value = [];
  } finally {
    carregando.value = false;
  }
}

onMounted(() => {
  carregar();
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.cordada-strip {
  margin: 0 8px 12px;
  padding: 10px 12px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.14);
  border: 1px solid rgba($cumes-01, 0.2);

  @media (min-width: 1024px) {
    margin: 0 0 20px;
  }
}

.cordada-strip__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.cordada-strip__label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.cordada-strip__ico {
  font-size: 1.05rem;
  color: $action-escaladas;
  opacity: 0.95;
}

.cordada-strip__titles {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.cordada-strip__titulo {
  font-size: 0.9rem;
  font-weight: 800;
  color: $offwhite;
  letter-spacing: -0.02em;
}

.cordada-strip__badge {
  font-size: 11px;
  font-weight: 800;
  color: $background;
  background: $cumes-03;
  padding: 2px 7px;
  border-radius: 999px;
  line-height: 1.2;
}

.cordada-strip__link {
  color: $action-escaladas !important;
  font-weight: 700 !important;
  font-size: 13px !important;
}

.cordada-strip__hint {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.35;
  color: rgba($offwhite, 0.45);
  font-weight: 500;
}

.cordada-strip__anon {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba($offwhite, 0.6);
  padding: 6px 0 2px;
}

.cordada-strip__login {
  color: $cumes-03 !important;
  font-weight: 700 !important;
}

.cordada-strip__loading {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.cordada-strip__vazio {
  font-size: 12px;
  color: rgba($offwhite, 0.4);
  padding: 6px 0 4px;
}

.cordada-strip__scroll-wrap {
  margin: 0 -4px;
  padding-bottom: 2px;
}

.cordada-strip__scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 4px 6px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($cumes-01, 0.35);
    border-radius: 4px;
  }
}

.cordada-strip__bubble {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  text-decoration: none;
  border: 2px solid rgba($offwhite, 0.14);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: border-color 0.15s ease, transform 0.12s ease;

  &:hover {
    border-color: rgba($cumes-03, 0.55);
  }

  &:active {
    transform: scale(0.96);
  }

  &--mais {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($cumes-03, 0.2);
    color: $action-escaladas;
    font-weight: 800;
    font-size: 11px;
    text-align: center;
    line-height: 1.1;
    padding: 4px;
  }
}

.cordada-strip__bubble-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cordada-strip__bubble-ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($offwhite, 0.07);
  color: rgba($offwhite, 0.35);
}
</style>
