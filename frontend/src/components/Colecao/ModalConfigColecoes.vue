<template>
  <q-dialog :model-value="modelValue" @update:model-value="aoAtualizarVisivel">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="edit" size="28px" class="title-icon" />
          <span>Editar Coleção</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-form class="edit-form" @submit.prevent="salvarMetadados">
          <!-- Capa -->
          <div class="form-field">
            <label class="field-label">Capa</label>
            <div class="preview-capa">
              <q-img v-if="urlExibicao" :src="urlExibicao" alt="Capa" fit="cover" class="img-capa" />
              <div v-else class="sem-capa">Sem imagem — usamos a foto da primeira via adicionada.</div>
            </div>
            <q-file
              ref="fileCapaRef"
              v-model="arquivoCapa"
              class="hidden-file"
              accept="image/jpeg,image/png,image/webp,image/*"
              max-file-size="2097152"
              @update:model-value="onArquivoCapaChange"
            />
            <div class="linha-botoes-cap">
              <q-btn
                unelevated
                no-caps
                icon="image"
                label="Escolher imagem"
                class="btn-secondary-custom"
                type="button"
                @click="abrirSeletorCapa"
              />
              <q-btn
                v-if="arquivoCapa"
                unelevated
                no-caps
                icon="cloud_upload"
                label="Enviar capa"
                class="btn-primary-custom"
                type="button"
                :loading="enviandoCapa"
                @click="emitirCapa"
              />
              <q-btn
                v-if="collectionData.capaPersonalizada"
                unelevated
                no-caps
                icon="close"
                label="Remover capa personalizada"
                class="btn-secondary-custom"
                type="button"
                :loading="removendoCapa"
                @click="emit('remover-capa')"
              />
            </div>
            <p class="hint-capa">Enquanto não houver capa própria, exibimos a imagem da primeira via da coleção.</p>
          </div>

          <div class="form-field">
            <label class="field-label" for="nome-colecao-modal">Nome da Coleção *</label>
            <q-input
              id="nome-colecao-modal"
              v-model="nome"
              class="custom-input"
              outlined
              dense
              lazy-rules
              :rules="[ val => !!val || 'Campo obrigatório' ]"
            />
          </div>

          <div class="form-field">
            <label class="field-label" for="desc-colecao-modal">Descrição da Coleção</label>
            <q-input
              id="desc-colecao-modal"
              v-model="descricao"
              type="textarea"
              class="custom-input"
              outlined
              dense
              rows="2"
            />
          </div>

          <div class="form-actions">
            <q-btn
              type="submit"
              label="Salvar nome e descrição"
              icon="save"
              class="btn-primary-custom"
              unelevated
              no-caps
              :loading="salvandoMetadados"
            />
            <q-btn
              label="Fechar"
              class="btn-secondary-custom"
              unelevated
              no-caps
              type="button"
              @click="fechar"
            />
          </div>
        </q-form>

        <div v-if="!ehFavoritos" class="zona-perigo">
          <q-separator class="q-my-md sep-colecao" />
          <q-btn
            unelevated
            no-caps
            icon="delete"
            label="Excluir coleção"
            class="btn-excluir-colecao"
            type="button"
            @click="confirmarExcluir = true"
          />
        </div>
        <p v-else class="hint-favoritos">
          <q-icon name="star" size="18px" class="q-mr-xs" />
          A coleção Favoritas não pode ser excluída.
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="confirmarExcluir">
    <q-card class="my-card card-confirm">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="warning" size="26px" class="title-icon" />
          <span>Excluir coleção?</span>
        </div>
      </q-card-section>
      <q-card-section class="card-body">
        <p class="texto-confirma-body">
          As vias não são apagadas — só o vínculo com esta coleção.
        </p>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn v-close-popup flat label="Cancelar" class="btn-secondary-custom" no-caps />
        <q-btn
          unelevated
          no-caps
          icon="delete"
          label="Excluir"
          class="btn-excluir-colecao"
          :loading="excluindo"
          @click="emitirExcluir"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IColecao } from 'src/models/IColecao';
import ImagemService from 'src/services/ImagemService';
import { ehColecaoFavoritos } from 'src/utils/colecaoUtils';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    collectionData: IColecao;
    salvandoMetadados?: boolean;
    enviandoCapa?: boolean;
    removendoCapa?: boolean;
    excluindo?: boolean;
  }>(),
  {
    salvandoMetadados: false,
    enviandoCapa: false,
    removendoCapa: false,
    excluindo: false
  }
);

const emit = defineEmits<{
  'update:modelValue': [boolean];
  edit: [{ nome: string; descricao: string }];
  'capa-enviada': [File];
  'remover-capa': [];
  'excluir-colecao': [];
}>();

const ehFavoritos = computed(() => ehColecaoFavoritos(props.collectionData));

const nome = ref('');
const descricao = ref('');
const arquivoCapa = ref<File | null>(null);
const urlArquivoLocal = ref<string | null>(null);
const fileCapaRef = ref<{ pickFiles: () => void } | null>(null);
const confirmarExcluir = ref(false);

watch(
  () => props.collectionData,
  (c) => {
    if (c) {
      nome.value = c.nome || '';
      descricao.value = c.descricao || '';
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (aberto) => {
    if (!aberto) {
      confirmarExcluir.value = false;
      arquivoCapa.value = null;
      if (urlArquivoLocal.value) {
        URL.revokeObjectURL(urlArquivoLocal.value);
        urlArquivoLocal.value = null;
      }
    }
  }
);

function onArquivoCapaChange (f: File | File[] | null) {
  const file = Array.isArray(f) ? f[0] : f;
  if (urlArquivoLocal.value) {
    URL.revokeObjectURL(urlArquivoLocal.value);
    urlArquivoLocal.value = null;
  }
  if (file) {
    urlArquivoLocal.value = URL.createObjectURL(file);
  }
}

const urlExibicao = computed(() => {
  if (urlArquivoLocal.value) return urlArquivoLocal.value;
  const u = props.collectionData?.imagemCapa?.url || props.collectionData?.imagem?.url;
  return u ? ImagemService.getFullImageUrl(u) : null;
});

function aoAtualizarVisivel (v: boolean) {
  emit('update:modelValue', v);
}

function fechar () {
  emit('update:modelValue', false);
}

function abrirSeletorCapa () {
  fileCapaRef.value?.pickFiles();
}

function emitirCapa () {
  const f = arquivoCapa.value;
  if (f) emit('capa-enviada', f);
}

function salvarMetadados () {
  if (!nome.value.trim()) return;
  emit('edit', { nome: nome.value.trim(), descricao: descricao.value || '' });
}

function emitirExcluir () {
  emit('excluir-colecao');
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

/* Mesmo padrão de AddColecaoModal / ItemSelectorModal */
.my-card {
  min-width: 320px;
  max-width: 500px;
  width: 92vw;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    width: 600px;
    max-width: 600px;
  }

  @media (min-width: 1024px) {
    width: 750px;
    max-width: 750px;
  }

  @media (min-width: 1440px) {
    width: 850px;
    max-width: 850px;
  }
}

.card-confirm {
  max-width: 440px !important;
  width: 92vw !important;

  @media (min-width: 768px) {
    width: 420px !important;
  }
}

.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;

  .title-icon {
    color: $cumes-04;
  }
}

.card-body {
  padding: 32px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.preview-capa {
  border-radius: 12px;
  overflow: hidden;
  background: rgba($offwhite, 0.06);
  border: 2px solid rgba($cumes-01, 0.45);
  min-height: 140px;
  max-height: 220px;
}

.img-capa {
  width: 100%;
  min-height: 140px;
  max-height: 220px;
}

.sem-capa {
  padding: 24px;
  text-align: center;
  color: rgba($offwhite, 0.55);
  font-size: 14px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden-file {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.linha-botoes-cap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.hint-capa {
  font-size: 12px;
  color: rgba($offwhite, 0.45);
  margin: 8px 0 0;
  line-height: 1.4;
}

.hint-favoritos {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: rgba($offwhite, 0.55);
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba($cumes-04, 0.08);
  border: 1px solid rgba($cumes-04, 0.25);
}

.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;

    &::before {
      border-color: $cumes-01;
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  :deep(input),
  :deep(textarea) {
    color: $background !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  :deep(input::placeholder),
  :deep(textarea::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;
      border-width: 2px;
    }
  }

  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba($cumes-03, 0.2);
  flex-wrap: wrap;
}

.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 8px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  min-height: 36px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: darken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
}

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 8px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  min-height: 36px !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
  }
}

.zona-perigo {
  margin-top: 8px;
}

.btn-excluir-colecao {
  background: rgba($error-color, 0.15) !important;
  color: lighten($error-color, 25%) !important;
  border: 2px solid rgba($error-color, 0.5) !important;
  font-weight: 700 !important;
}

.texto-confirma-body {
  margin: 0;
  line-height: 1.5;
  color: rgba($offwhite, 0.85);
  font-size: 15px;
}

.sep-colecao {
  opacity: 0.35;
  background: rgba($cumes-03, 0.5);
}
</style>
