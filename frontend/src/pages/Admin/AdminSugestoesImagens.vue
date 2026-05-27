<template>
  <q-page class="admin-page">
    <div class="page-header">
      <q-btn flat round icon="arrow_back" class="btn-voltar" @click="$router.push('/admin')" />
      <q-icon name="photo_library" size="26px" class="page-icon" />
      <h1 class="page-titulo">Sugestões de Fotos</h1>
    </div>

    <!-- Filtro de status -->
    <div class="filtro-status">
      <q-btn
        v-for="op in opcoesStatus"
        :key="op.valor"
        :label="op.label"
        :class="['btn-filtro', { 'btn-filtro--ativo': filtroAtivo === op.valor }]"
        unelevated no-caps
        @click="filtroAtivo = op.valor"
      />
    </div>

    <!-- Lista de sugestões -->
    <div v-if="carregando" class="estado-carregando">
      <q-spinner size="40px" color="orange" />
    </div>

    <div v-else-if="sugestoesFiltradas.length === 0" class="estado-vazio">
      <q-icon name="check_circle" size="48px" class="vazio-icone" />
      <span>Nenhuma sugestão {{ filtroAtivo === 'pendente' ? 'pendente' : '' }}</span>
    </div>

    <div v-else class="sugestoes-lista">
      <div v-for="s in sugestoesFiltradas" :key="s.id" class="sugestao-card">
        <div class="sugestao-foto-wrap">
          <img
            :src="obterUrl(s.imagem.url)"
            :alt="`Sugestão ${s.id}`"
            class="sugestao-foto"
          />
        </div>

        <div class="sugestao-info">
          <div class="sugestao-via">{{ s.via.nome }}</div>

          <div class="sugestao-meta">
            <span>por <strong>@{{ s.usuario?.username ?? 'anônimo' }}</strong></span>
            <span class="meta-sep">·</span>
            <span>{{ formatarData(s.created_at) }}</span>
          </div>

          <div v-if="s.creditos" class="sugestao-creditos">
            <q-icon name="photo_camera" size="13px" />
            {{ s.creditos }}
          </div>

          <div v-if="s.status !== 'pendente'" class="sugestao-status" :class="`status--${s.status}`">
            {{ s.status === 'aprovada' ? 'Aprovada' : 'Rejeitada' }}
            <span v-if="s.motivo_rejeicao"> — {{ s.motivo_rejeicao }}</span>
          </div>
        </div>

        <div v-if="s.status === 'pendente'" class="sugestao-acoes">
          <q-btn
            icon="check"
            label="Aprovar"
            class="btn-aprovar"
            unelevated no-caps
            :loading="processando === s.id + '-aprovar'"
            @click="aprovar(s)"
          />
          <q-btn
            icon="close"
            label="Rejeitar"
            class="btn-rejeitar"
            unelevated no-caps
            :loading="processando === s.id + '-rejeitar'"
            @click="abrirRejeicao(s)"
          />
        </div>
      </div>
    </div>

    <!-- Modal de rejeição -->
    <q-dialog v-model="modalRejeicaoAberto">
      <q-card class="modal-rejeicao">
        <q-card-section class="modal-header">
          <div class="modal-title">
            <q-icon name="cancel" size="24px" class="title-icon" />
            <span>Rejeitar sugestão</span>
          </div>
        </q-card-section>

        <q-card-section class="modal-body">
          <div class="form-field">
            <label class="field-label">Motivo da rejeição *</label>
            <q-input
              v-model="motivoRejeicao"
              outlined
              dense
              autogrow
              class="custom-input"
              placeholder="Ex: Foto com baixa qualidade, fora de foco..."
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn label="Cancelar" class="btn-secondary-custom" v-close-popup unelevated no-caps />
          <q-btn
            label="Confirmar rejeição"
            class="btn-danger-custom"
            unelevated no-caps
            :disable="!motivoRejeicao.trim()"
            @click="confirmarRejeicao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import ViaImageSugestaoService from 'src/services/ViaImageSugestaoService';
import ImagemService from 'src/services/ImagemService';
import type { IViaImageSugestao } from 'src/models/IViaImageSugestao';

const $q = useQuasar();
const carregando = ref(true);
const sugestoes = ref<IViaImageSugestao[]>([]);
const processando = ref<string | null>(null);
const filtroAtivo = ref<'pendente' | 'aprovada' | 'rejeitada' | 'todas'>('pendente');
const modalRejeicaoAberto = ref(false);
const motivoRejeicao = ref('');
const sugestaoParaRejeitar = ref<IViaImageSugestao | null>(null);

const opcoesStatus = [
  { valor: 'pendente', label: 'Pendentes' },
  { valor: 'aprovada', label: 'Aprovadas' },
  { valor: 'rejeitada', label: 'Rejeitadas' },
  { valor: 'todas', label: 'Todas' }
] as const;

const sugestoesFiltradas = computed(() => {
  if (filtroAtivo.value === 'todas') return sugestoes.value;
  return sugestoes.value.filter(s => s.status === filtroAtivo.value);
});

onMounted(carregar);

async function carregar () {
  carregando.value = true;
  sugestoes.value = await ViaImageSugestaoService.listarTodasAdmin();
  carregando.value = false;
}

async function aprovar (s: IViaImageSugestao) {
  processando.value = `${s.id}-aprovar`;
  const resultado = await ViaImageSugestaoService.aprovar(s.id);
  if (resultado) {
    const idx = sugestoes.value.findIndex(x => x.id === s.id);
    if (idx !== -1) sugestoes.value[idx] = resultado;
    $q.notify({ type: 'positive', message: 'Foto aprovada e publicada na via.', position: 'top-right' });
  }
  processando.value = null;
}

function abrirRejeicao (s: IViaImageSugestao) {
  sugestaoParaRejeitar.value = s;
  motivoRejeicao.value = '';
  modalRejeicaoAberto.value = true;
}

async function confirmarRejeicao () {
  if (!sugestaoParaRejeitar.value || !motivoRejeicao.value.trim()) return;
  const s = sugestaoParaRejeitar.value;
  processando.value = `${s.id}-rejeitar`;
  modalRejeicaoAberto.value = false;

  const resultado = await ViaImageSugestaoService.rejeitar(s.id, motivoRejeicao.value);
  if (resultado) {
    const idx = sugestoes.value.findIndex(x => x.id === s.id);
    if (idx !== -1) sugestoes.value[idx] = resultado;
    $q.notify({ type: 'warning', message: 'Sugestão rejeitada.', position: 'top-right' });
  }
  processando.value = null;
}

function obterUrl (url: string) {
  return ImagemService.obterUrlCompleta(url);
}

function formatarData (iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.btn-voltar { color: rgba($offwhite, 0.7) !important; }
.page-icon { color: $cumes-01; }
.page-titulo { font-size: 20px; font-weight: 800; color: $offwhite; margin: 0; }

.filtro-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.btn-filtro {
  background: rgba($offwhite, 0.07) !important;
  color: rgba($offwhite, 0.65) !important;
  border: 1px solid rgba($offwhite, 0.12) !important;
  border-radius: 99px !important;
  font-size: 13px !important;
  padding: 6px 16px !important;
  &--ativo {
    background: rgba($cumes-01, 0.2) !important;
    color: $cumes-01 !important;
    border-color: $cumes-01 !important;
  }
}

.estado-carregando, .estado-vazio {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 48px;
  color: rgba($offwhite, 0.45);
  font-size: 14px;
}
.vazio-icone { color: $cumes-03; }

.sugestoes-lista { display: flex; flex-direction: column; gap: 12px; }

.sugestao-card {
  display: flex;
  gap: 14px;
  padding: 14px;
  background: rgba($surface, 0.7);
  border: 1px solid rgba($cumes-01, 0.15);
  border-radius: 14px;
  align-items: flex-start;
}

.sugestao-foto-wrap {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba($offwhite, 0.05);
}
.sugestao-foto { width: 100%; height: 100%; object-fit: cover; }

.sugestao-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.sugestao-via { font-size: 14px; font-weight: 700; color: $offwhite; }
.sugestao-meta { font-size: 12px; color: rgba($offwhite, 0.55); }
.meta-sep { margin: 0 4px; }
.sugestao-creditos { font-size: 12px; color: rgba($offwhite, 0.6); display: flex; align-items: center; gap: 4px; }
.sugestao-status {
  font-size: 12px; font-weight: 600; margin-top: 4px;
  &.status--aprovada { color: $cumes-03; }
  &.status--rejeitada { color: $error-color; }
}

.sugestao-acoes { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }

.btn-aprovar {
  background: rgba($cumes-03, 0.15) !important;
  color: $cumes-03 !important;
  border: 1px solid rgba($cumes-03, 0.5) !important;
  border-radius: 8px !important;
  font-size: 12px !important;
}
.btn-rejeitar {
  background: rgba($error-color, 0.1) !important;
  color: $error-color !important;
  border: 1px solid rgba($error-color, 0.4) !important;
  border-radius: 8px !important;
  font-size: 12px !important;
}

// Modal de rejeição
.modal-rejeicao {
  background-color: $background;
  border: 2px solid $error-color;
  border-radius: 16px;
  width: 92vw;
  max-width: 460px;
}
.modal-header {
  background: $error-color;
  border-radius: 14px 14px 0 0;
}
.modal-title { display: flex; align-items: center; gap: 10px; color: $offwhite; font-size: 16px; font-weight: 700; }
.title-icon { color: $offwhite; }
.modal-body { padding: 20px; }
.modal-actions { padding: 12px 20px; border-top: 1px solid rgba($error-color, 0.2); }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 700; color: $cumes-04; text-transform: uppercase; letter-spacing: 0.8px; }
.custom-input {
  :deep(.q-field__control) { background-color: $offwhite; border-radius: 8px; padding: 0 !important; &::before { border-color: $error-color; border-width: 2px; } }
  :deep(.q-field__native) { color: $background; padding: 10px 14px !important; }
}
.btn-secondary-custom { background: transparent !important; color: rgba($offwhite, 0.7) !important; border: 1px solid rgba($offwhite, 0.3) !important; border-radius: 8px !important; }
.btn-danger-custom { background: $error-color !important; color: $offwhite !important; border-radius: 8px !important; font-weight: 700 !important; &:disabled { opacity: 0.4 !important; } }
</style>
