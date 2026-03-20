<template>
  <q-page class="escalada-page">
    <!-- Carregando -->
    <div v-if="carregando" class="estado-centro">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <!-- Não encontrada / privada / removida -->
    <div v-else-if="naoEncontrada" class="estado-centro estado-indisponivel">
      <i class="pi pi-eye-slash" />
      <span class="indisponivel-titulo">Escalada indisponível</span>
      <span class="indisponivel-sub">Este registro não existe ou não pode ser exibido (perfil privado do autor).</span>
      <q-btn flat no-caps label="Voltar" class="btn-voltar" @click="router.back()" />
    </div>

    <!-- Conteúdo -->
    <template v-else-if="escalada">
      <div class="escalada-inner">
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

      <div v-if="linhasSobreVia.length" class="sobre-via">
        <h2 class="secao-titulo">Sobre a via</h2>
        <div class="sobre-via-grid">
          <div
            v-for="(linha, idx) in linhasSobreVia"
            :key="idx"
            class="sobre-via-linha"
          >
            <span class="sobre-via-label">{{ linha.label }}</span>
            <span class="sobre-via-valor">{{ linha.valor }}</span>
          </div>
        </div>
      </div>

      <h2 class="secao-titulo secao-titulo-escalada">Registro da escalada</h2>
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
import type { Via } from 'src/models/Via';

function formatarModalidade (m: string | undefined): string | null {
  if (!m) return null;
  const map: Record<string, string> = {
    TRADICIONAL: 'Tradicional',
    ESPORTIVA: 'Esportiva',
    BOULDER: 'Boulder',
    BIG_WALL: 'Big wall',
    ARTIFICIAL: 'Artificial',
    PSICOBLOC: 'Psicobloc'
  };
  return map[m] || m;
}

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

const viaDetalhe = computed(() => escalada.value?.via as Via | undefined);

const linhasSobreVia = computed(() => {
  const v = viaDetalhe.value;
  if (!v) return [] as { label: string; valor: string }[];
  const linhas: { label: string; valor: string }[] = [];
  const mont =
    v.setor?.montanha?.nome ||
    v.setor?.face?.montanha?.nome ||
    v.face?.montanha?.nome ||
    v.montanha?.nome;
  if (mont) linhas.push({ label: 'Montanha', valor: mont });
  const face = v.setor?.face?.nome || v.face?.nome;
  if (face) linhas.push({ label: 'Face', valor: face });
  if (v.setor?.nome) linhas.push({ label: 'Setor', valor: v.setor.nome });
  const loc = v.localizacao;
  if (loc?.cidade?.nome) {
    const partes = [loc.cidade.nome, loc.estado?.sigla].filter(Boolean);
    linhas.push({ label: 'Cidade', valor: partes.join(' · ') });
  } else if (loc?.estado?.nome) {
    linhas.push({
      label: 'Estado',
      valor: loc.estado.sigla
        ? `${loc.estado.nome} (${loc.estado.sigla})`
        : loc.estado.nome
    });
  }
  if (v.extensao != null && v.extensao > 0) {
    linhas.push({ label: 'Extensão', valor: `${v.extensao} m` });
  }
  const mod = formatarModalidade(v.modalidade);
  if (mod) linhas.push({ label: 'Modalidade', valor: mod });
  if (v.exposicao) {
    const rawExp = String(v.exposicao).trim();
    const expFmt = rawExp.toUpperCase().startsWith('E')
      ? rawExp.toUpperCase()
      : `E${rawExp.toUpperCase()}`;
    linhas.push({ label: 'Exposição', valor: expFmt });
  }
  if (v.crux) linhas.push({ label: 'Crux', valor: v.crux });
  if (v.duracao) {
    const cod = String(v.duracao).trim();
    const chave = cod.toUpperCase().startsWith('D') ? cod.toUpperCase() : `D${cod.toUpperCase()}`;
    linhas.push({ label: 'Duração', valor: chave });
  }
  if (v.tipo_escalada) linhas.push({ label: 'Tipo de escalada', valor: v.tipo_escalada });
  if (v.tipo_rocha) linhas.push({ label: 'Tipo de rocha', valor: v.tipo_rocha });
  if (v.detalhes) {
    const t =
      v.detalhes.length > 320 ? `${v.detalhes.slice(0, 320)}…` : v.detalhes;
    linhas.push({ label: 'Detalhes da via', valor: t });
  }
  return linhas;
});

const participantesFormatados = computed(() => {
  return escalada.value?.participantes
    ?.map((p: any) => {
      const nome = p.nome || p.usuario?.nome;
      if (p.username && nome) return `${nome} (@${p.username})`;
      if (p.username) return `@${p.username}`;
      return nome;
    })
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
  padding: 24px 20px 0;
  max-width: 100%;
}

.escalada-inner {
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
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

.estado-indisponivel {
  text-align: center;
  padding: 0 16px;

  .indisponivel-titulo {
    font-size: 18px;
    font-weight: 700;
    color: rgba($offwhite, 0.85);
  }

  .indisponivel-sub {
    font-size: 14px;
    font-weight: 400;
    color: rgba($offwhite, 0.45);
    max-width: 320px;
    line-height: 1.4;
  }
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
.secao-titulo {
  font-size: 13px;
  font-weight: 800;
  color: rgba($offwhite, 0.45);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px;
}

.secao-titulo-escalada {
  margin-top: 28px;
}

.sobre-via {
  margin-bottom: 8px;
}

.sobre-via-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 600px) {
  .sobre-via-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.sobre-via-linha {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba($offwhite, 0.03);
  border: 1px solid rgba($offwhite, 0.07);
}

.sobre-via-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba($offwhite, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sobre-via-valor {
  font-size: 14px;
  color: rgba($offwhite, 0.92);
  line-height: 1.45;
  white-space: pre-wrap;
}

.via-destaque {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  cursor: pointer;
  min-height: 200px;
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
