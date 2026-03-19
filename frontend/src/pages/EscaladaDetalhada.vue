<template>
  <q-page class="escalada-page">
    <!-- Carregando -->
    <div v-if="carregando" class="estado-centro">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <!-- Não encontrada / perfil privado -->
    <div v-else-if="naoEncontrada" class="estado-centro">
      <i class="pi pi-lock" />
      <span>Escalada não encontrada</span>
      <q-btn flat label="Voltar" class="btn-voltar" @click="router.back()" />
    </div>

    <!-- Conteúdo -->
    <template v-else-if="escalada">
      <!-- Header: usuário -->
      <div class="escalada-header">
        <router-link :to="linkPerfil" class="header-usuario">
          <img v-if="avatarUrl" :src="avatarUrl" alt="" class="header-avatar" />
          <div v-else class="header-avatar-placeholder"><i class="pi pi-user" /></div>
          <div class="header-usuario-info">
            <span class="header-usuario-nome">{{ escalada.usuario?.nome }}</span>
            <span class="header-usuario-sub">registrou uma escalada</span>
          </div>
        </router-link>
        <span class="header-data">{{ dataFormatada }}</span>
      </div>

      <!-- Via em destaque -->
      <div class="via-destaque" @click="irParaVia">
        <div v-if="viaImageUrl" class="via-destaque-bg">
          <img :src="viaImageUrl" alt="" class="via-destaque-img" />
          <div class="via-destaque-overlay" />
        </div>
        <div class="via-destaque-conteudo">
          <span class="via-destaque-label">Via escalada</span>
          <h1 class="via-destaque-nome">{{ escalada.via?.nome }}</h1>
          <div v-if="escalada.via" class="via-destaque-grau">
            <GrauBadge :via="escalada.via" />
          </div>
          <span class="via-destaque-link">
            <i class="pi pi-external-link" /> Ver detalhes da via
          </span>
        </div>
      </div>

      <!-- Detalhes da escalada -->
      <div class="escalada-detalhes">
        <!-- Observação -->
        <div v-if="escalada.observacao" class="detalhe-item">
          <i class="pi pi-comment detalhe-icone" />
          <div>
            <span class="detalhe-label">Observações</span>
            <p class="detalhe-valor">{{ escalada.observacao }}</p>
          </div>
        </div>

        <!-- Data -->
        <div class="detalhe-item">
          <i class="pi pi-calendar detalhe-icone" />
          <div>
            <span class="detalhe-label">Data da escalada</span>
            <p class="detalhe-valor">{{ dataCompletaFormatada }}</p>
          </div>
        </div>

        <!-- Participantes -->
        <div v-if="escalada.participantes?.length" class="detalhe-item">
          <i class="pi pi-users detalhe-icone" />
          <div>
            <span class="detalhe-label">Participantes</span>
            <p class="detalhe-valor">{{ participantesFormatados }}</p>
          </div>
        </div>
      </div>
    </template>

    <div class="page-bottom-spacer" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import ImagemService from 'src/services/ImagemService';
import { getViaImageUrlFull } from 'src/utils/utils';
import GrauBadge from 'src/components/Via/GrauBadge.vue';

const route = useRoute();
const router = useRouter();

const escalada = ref<any>(null);
const carregando = ref(true);
const naoEncontrada = ref(false);

const avatarUrl = computed(() => {
  const url = escalada.value?.usuario?.foto_perfil?.url;
  return url ? ImagemService.getFullImageUrl(url) : null;
});

const viaImageUrl = computed(() => {
  const via = escalada.value?.via;
  if (!via) return null;
  const viaParaImagem = {
    imagem: via.imagem ?? via.viaImagens?.[0]?.imagem,
    imagens: via.imagens ?? via.viaImagens?.map((vi: any) => vi.imagem).filter(Boolean)
  };
  return getViaImageUrlFull(viaParaImagem);
});

const linkPerfil = computed(() => {
  const username = escalada.value?.usuario?.username;
  return username ? `/perfil/${username}` : '/perfil';
});

function parsearData(data: string | Date): Date {
  if (typeof data === 'string') {
    return data.includes('T') ? new Date(data) : new Date(data + 'T00:00:00');
  }
  return data;
}

const dataFormatada = computed(() => {
  if (!escalada.value?.data) return '';
  const d = parsearData(escalada.value.data);
  const hoje = new Date();
  const dSemHora = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diffDias = Math.floor((hojeSemHora.getTime() - dSemHora.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias === 0) return 'Hoje';
  if (diffDias === 1) return 'Ontem';
  return `${diffDias} dias atrás`;
});

const dataCompletaFormatada = computed(() => {
  if (!escalada.value?.data) return '';
  const d = parsearData(escalada.value.data);
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
});

const participantesFormatados = computed(() => {
  return escalada.value?.participantes
    ?.map((p: any) => p.nome || p.usuario?.nome)
    .filter(Boolean)
    .join(', ') || '';
});

function irParaVia() {
  const viaId = escalada.value?.via?.id;
  if (viaId) router.push({ name: 'ViaDetalhada', params: { id: String(viaId) } });
}

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) { naoEncontrada.value = true; carregando.value = false; return; }
  try {
    escalada.value = await EscaladaService.obterPorId(id);
  } catch {
    naoEncontrada.value = true;
  } finally {
    carregando.value = false;
  }
});
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.escalada-page {
  padding: 16px 16px 0;
  max-width: 680px;
  margin: 0 auto;
}

.estado-centro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 40vh;
  color: rgba($offwhite, 0.5);
  font-size: 16px;

  i { font-size: 48px; color: $cumes-03; }
}

.btn-voltar { color: $cumes-01; }

// ---- Header: usuário ----
.escalada-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.header-usuario {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  &:hover .header-usuario-nome { color: $cumes-04; }
}

.header-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid $cumes-01;
}

.header-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba($cumes-01, 0.15);
  border: 2.5px solid rgba($cumes-01, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $cumes-01;
  font-size: 18px;
}

.header-usuario-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-usuario-nome {
  font-size: 15px;
  font-weight: 700;
  color: $cumes-01;
}

.header-usuario-sub {
  font-size: 12px;
  color: rgba($offwhite, 0.4);
}

.header-data {
  font-size: 13px;
  font-weight: 600;
  color: $cumes-04;
}

// ---- Via em destaque ----
.via-destaque {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  min-height: 160px;
  background: rgba($offwhite, 0.05);
  border: 1px solid rgba($offwhite, 0.1);

  &:hover .via-destaque-link { color: $cumes-04; }
}

.via-destaque-bg {
  position: absolute;
  inset: 0;
}

.via-destaque-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.via-destaque-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba($background, 0.92) 0%, rgba($background, 0.6) 100%);
}

.via-destaque-conteudo {
  position: relative;
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.via-destaque-label {
  font-size: 11px;
  font-weight: 700;
  color: $cumes-03;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.via-destaque-nome {
  font-size: 28px;
  font-weight: 800;
  color: $offwhite;
  margin: 0;
  line-height: 1.15;
}

.via-destaque-grau {
  :deep(.grau-badge) { width: fit-content; }
}

.via-destaque-link {
  font-size: 12px;
  color: rgba($offwhite, 0.4);
  margin-top: 4px;
  transition: color 0.2s;

  i { font-size: 11px; }
}

// ---- Detalhes ----
.escalada-detalhes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detalhe-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba($offwhite, 0.04);
  border: 1px solid rgba($offwhite, 0.07);
}

.detalhe-icone {
  font-size: 18px;
  color: $cumes-03;
  flex-shrink: 0;
  margin-top: 2px;
}

.detalhe-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba($offwhite, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: block;
  margin-bottom: 4px;
}

.detalhe-valor {
  font-size: 14px;
  color: $offwhite;
  margin: 0;
  line-height: 1.5;
}

.page-bottom-spacer { height: 100px; }
</style>
