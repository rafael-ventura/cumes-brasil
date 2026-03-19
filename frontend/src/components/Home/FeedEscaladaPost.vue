<template>
  <article class="feed-post" @click="irParaEscalada">
    <!-- Coluna esquerda: usuário -->
    <router-link :to="linkPerfil" class="col-usuario" @click.stop>
      <img v-if="avatarUrl" :src="avatarUrl" alt="" class="post-avatar" />
      <div v-else class="post-avatar-placeholder"><i class="pi pi-user" /></div>
      <span class="post-usuario-nome">{{ usuario?.nome || 'Escalador' }}</span>
    </router-link>

    <!-- Divisor -->
    <div class="post-divisor" />

    <!-- Coluna direita: via + grau -->
    <div class="col-via">
      <h3 class="post-via-nome" @click.stop="irParaVia">{{ via?.nome || 'Via' }}</h3>
      <div v-if="via" class="post-grau"><GrauBadge :via="via" /></div>
    </div>

    <!-- Data -->
    <div class="post-data-wrap">
      <span class="post-data-principal">{{ diaMesDaData }}</span>
      <span class="post-data-relativa">{{ tempoRelativo }}</span>
    </div>

    <i class="pi pi-chevron-right post-seta" />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import ImagemService from 'src/services/ImagemService';

const props = defineProps<{
  escalada: {
    id?: number;
    data: string | Date;
    usuario?: {
      id: number;
      nome: string;
      username?: string;
      foto_perfil?: { url?: string };
    };
    via?: {
      id: number;
      nome: string;
      grau?: string;
      crux?: string;
      artificial?: string;
      duracao?: string;
      exposicao?: string;
      extensao?: number;
      viaImagens?: Array<{ imagem?: { url?: string } }>;
      imagem?: { url?: string };
      imagens?: Array<{ url?: string }>;
    };
  };
}>();

const router = useRouter();

const usuario = computed(() => props.escalada.usuario);
const via = computed(() => props.escalada.via);

const linkPerfil = computed(() => {
  const username = usuario.value?.username;
  return username ? { path: `/perfil/${username}` } : '/perfil';
});

const avatarUrl = computed(() => {
  const url = usuario.value?.foto_perfil?.url;
  return url ? ImagemService.getFullImageUrl(url) : null;
});

function parsearData(data: string | Date): Date {
  if (typeof data === 'string') {
    return data.includes('T') ? new Date(data) : new Date(data + 'T00:00:00');
  }
  return data;
}

const diaMesDaData = computed(() => {
  const d = parsearData(props.escalada.data);
  const dia = d.toLocaleDateString('pt-BR', { day: '2-digit' });
  const mes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `${dia} ${mes}`;
});

const tempoRelativo = computed(() => {
  const d = parsearData(props.escalada.data);
  const hoje = new Date();
  const dSemHora = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diffDias = Math.floor((hojeSemHora.getTime() - dSemHora.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias === 0) {
    const diffHoras = Math.floor((hoje.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHoras < 1) return 'agora';
    if (diffHoras === 1) return '1 hr atrás';
    return `${diffHoras} hrs atrás`;
  }
  if (diffDias === 1) return '1 dia atrás';
  return `${diffDias} dias atrás`;
});

function irParaEscalada() {
  if (props.escalada.id) {
    router.push({ name: 'EscaladaDetalhada', params: { id: String(props.escalada.id) } });
  }
}

function irParaVia() {
  const viaId = via.value?.id;
  if (viaId) {
    router.push({ name: 'ViaDetalhada', params: { id: String(viaId) } });
  }
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.feed-post {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba($offwhite, 0.04);
  border: 1px solid rgba($offwhite, 0.08);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: rgba($offwhite, 0.07);
    border-color: rgba($cumes-01, 0.3);
    .post-seta { color: $cumes-03; }
  }
}

// ---- Coluna esquerda: usuário ----
.col-usuario {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  flex-shrink: 0;
  width: 60px;

  &:hover .post-usuario-nome { color: $cumes-04; }
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid $cumes-01;
  display: block;
}

.post-avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba($cumes-01, 0.15);
  border: 2.5px solid rgba($cumes-01, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $cumes-01;
  font-size: 16px;
}

.post-usuario-nome {
  font-size: 10px;
  font-weight: 600;
  color: $cumes-01;
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
  max-width: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ---- Divisor ----
.post-divisor {
  width: 1px;
  height: 52px;
  background: rgba($offwhite, 0.09);
  flex-shrink: 0;
}

// ---- Coluna direita: via ----
.col-via {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.post-via-nome {
  font-size: 17px;
  font-weight: 800;
  color: $offwhite;
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;

  &:hover { color: $cumes-04; text-decoration: underline; }
}

.post-grau {
  :deep(.grau-badge) {
    max-width: none;
    width: fit-content;
  }
}

// ---- Data ----
.post-data-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 52px;
}

.post-data-principal {
  font-size: 14px;
  font-weight: 800;
  color: $cumes-04;
  white-space: nowrap;
  line-height: 1.1;
}

.post-data-relativa {
  font-size: 10px;
  font-weight: 500;
  color: rgba($cumes-04, 0.55);
  white-space: nowrap;
}

// ---- Seta ----
.post-seta {
  font-size: 12px;
  color: rgba($offwhite, 0.2);
  flex-shrink: 0;
  transition: color 0.2s;
}
</style>
