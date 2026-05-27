<template>
  <q-dialog v-model="aberto" @hide="aoFechar">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="modal-title">
          <q-icon name="add_photo_alternate" size="28px" class="title-icon" />
          <span>Adicionar Foto</span>
        </div>
        <q-btn flat round icon="close" class="btn-fechar" v-close-popup />
      </q-card-section>

      <q-card-section class="modal-body">
        <p class="instrucao">Selecione uma foto da via para sugerir. Após a revisão de um administrador, ela será publicada.</p>

        <!-- Upload de arquivo -->
        <div class="upload-area" :class="{ 'upload-area--com-preview': previewUrl }" @click="abrirSeletorArquivo">
          <input
            ref="inputArquivo"
            type="file"
            accept="image/*"
            class="input-hidden"
            @change="aoSelecionarArquivo"
          />
          <div v-if="!previewUrl" class="upload-placeholder">
            <q-icon name="cloud_upload" size="48px" class="upload-icon" />
            <span class="upload-texto">Clique para selecionar uma foto</span>
            <span class="upload-subtexto">JPG, PNG, WEBP — máximo 5MB</span>
          </div>
          <div v-else class="upload-preview">
            <img :src="previewUrl" alt="Preview da foto" class="preview-img" />
            <div class="preview-overlay">
              <q-icon name="edit" size="24px" />
              <span>Trocar foto</span>
            </div>
          </div>
        </div>

        <div v-if="erroArquivo" class="erro-arquivo">{{ erroArquivo }}</div>

        <!-- Campo de créditos -->
        <div class="form-field q-mt-md">
          <label class="field-label">Créditos da foto</label>
          <q-input
            v-model="creditos"
            outlined
            dense
            placeholder="Ex: @fulano.escalada, João Silva"
            class="custom-input"
            maxlength="255"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="modal-actions">
        <q-btn label="Cancelar" class="btn-secondary-custom" v-close-popup unelevated no-caps />
        <q-btn
          label="Enviar sugestão"
          class="btn-primary-custom"
          :loading="enviando"
          :disable="!arquivoSelecionado"
          unelevated
          no-caps
          @click="aoEnviar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import ViaImageSugestaoService from 'src/services/ViaImageSugestaoService';

const props = defineProps<{ viaId: number }>();
const emit = defineEmits<{ (e: 'enviado'): void }>();

const aberto = defineModel<boolean>({ default: false });

const $q = useQuasar();
const inputArquivo = ref<HTMLInputElement | null>(null);
const arquivoSelecionado = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const creditos = ref('');
const enviando = ref(false);
const erroArquivo = ref('');

const TAMANHO_MAXIMO = 5 * 1024 * 1024;

function abrirSeletorArquivo () {
  inputArquivo.value?.click();
}

function aoSelecionarArquivo (event: Event) {
  const input = event.target as HTMLInputElement;
  const arquivo = input.files?.[0];
  erroArquivo.value = '';

  if (!arquivo) return;

  if (arquivo.size > TAMANHO_MAXIMO) {
    erroArquivo.value = 'A foto não pode ultrapassar 5MB.';
    return;
  }

  if (!arquivo.type.startsWith('image/')) {
    erroArquivo.value = 'Somente arquivos de imagem são aceitos.';
    return;
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  arquivoSelecionado.value = arquivo;
  previewUrl.value = URL.createObjectURL(arquivo);
}

async function aoEnviar () {
  if (!arquivoSelecionado.value) return;
  enviando.value = true;

  try {
    await ViaImageSugestaoService.submeterSugestao(props.viaId, arquivoSelecionado.value, creditos.value);
    $q.notify({ type: 'positive', message: 'Sugestão enviada! Será revisada em breve.', position: 'top-right' });
    emit('enviado');
    aberto.value = false;
  } finally {
    enviando.value = false;
  }
}

function aoFechar () {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  arquivoSelecionado.value = null;
  creditos.value = '';
  erroArquivo.value = '';
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.modal-card {
  background-color: $background;
  border: 2px solid $cumes-01;
  border-radius: 16px;
  box-shadow: 0 8px 32px $box-shadow-dark;
  width: 92vw;
  max-width: 500px;

  @media (min-width: 768px) { width: 520px; }
}

.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  border-bottom: 3px solid $cumes-03;
  border-radius: 14px 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $offwhite;
  font-size: 18px;
  font-weight: 700;
  .title-icon { color: $cumes-04; }
}

.btn-fechar { color: $offwhite !important; }

.modal-body {
  padding: 20px;
}

.instrucao {
  color: rgba($offwhite, 0.75);
  font-size: 13px;
  margin: 0 0 16px;
}

.upload-area {
  border: 2px dashed rgba($cumes-01, 0.5);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: $cumes-01;
    background: rgba($cumes-01, 0.06);
  }

  &--com-preview { border-style: solid; }
}

.input-hidden { display: none; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.upload-icon { color: rgba($cumes-01, 0.6); }
.upload-texto { color: $offwhite; font-size: 14px; font-weight: 600; }
.upload-subtexto { color: rgba($offwhite, 0.5); font-size: 12px; }

.upload-preview {
  position: relative;
  width: 100%;

  .preview-img {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    display: block;
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: $offwhite;
    font-size: 13px;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .preview-overlay { opacity: 1; }
}

.erro-arquivo {
  color: $error-color;
  font-size: 12px;
  margin-top: 6px;
}

.form-field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;
    &::before { border-color: $cumes-01; border-width: 2px; }
  }
  :deep(.q-field__native) { color: $background; font-size: 15px; padding: 10px 14px !important; }
  :deep(input) { padding: 10px 14px !important; }
  :deep(input::placeholder) { color: rgba($background, 0.5); }
}

.modal-actions {
  padding: 12px 20px 16px;
  border-top: 1px solid rgba($cumes-01, 0.2);
}

.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 10px 24px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  &:hover { background: darken($cumes-01, 10%) !important; }
  &:disabled { opacity: 0.5 !important; }
}

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
}
</style>
