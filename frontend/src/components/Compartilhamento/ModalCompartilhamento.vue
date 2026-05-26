<template>
  <q-dialog v-model="modelValueLocal">
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="modal-title">
          <q-icon name="share" size="28px" class="title-icon" />
          <span>Compartilhar</span>
        </div>
      </q-card-section>

      <q-card-section class="modal-body">
        <div class="share-modal__conteudo">
          <div v-if="dadosCompartilhamento?.titulo" class="share-modal__titulo">
            {{ dadosCompartilhamento.titulo }}
          </div>
          <div v-if="dadosCompartilhamento?.texto" class="share-modal__texto">
            {{ dadosCompartilhamento.texto }}
          </div>

          <div
            v-if="dadosCompartilhamento?.url"
            class="share-modal__url-wrapper"
          >
            <div class="share-modal__url-label">Link</div>
            <div class="share-modal__url">{{ dadosCompartilhamento.url }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="modal-actions">
        <div class="modal-actions__right">
          <q-btn
            flat
            no-caps
            icon="content_copy"
            label="Copiar texto"
            class="btn-modal-acao"
            @click="copiarTextoCompartilhamento"
          />
          <q-btn
            flat
            no-caps
            icon="link"
            label="Copiar link"
            class="btn-modal-acao"
            :disable="!dadosCompartilhamento?.url"
            @click="copiarLink"
          />
          <q-btn
            flat
            no-caps
            label="Fechar"
            class="btn-modal-fechar"
            @click="fechar"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DadosCompartilhamento } from 'src/utils/share';
import { copiarTextoCompartilhamentoUtil, gerarTextoCompartilhamento } from 'src/utils/share';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  dadosCompartilhamento?: DadosCompartilhamento | null;
}>(), {
  dadosCompartilhamento: null
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
});

const textoParaCopiar = computed(() => {
  return props.dadosCompartilhamento ? gerarTextoCompartilhamento(props.dadosCompartilhamento) : '';
});

async function copiarTextoCompartilhamento () {
  if (!textoParaCopiar.value) return;
  await copiarTextoCompartilhamentoUtil(textoParaCopiar.value);
}

async function copiarLink () {
  if (!props.dadosCompartilhamento?.url) return;
  await copiarTextoCompartilhamentoUtil(props.dadosCompartilhamento.url);
}

function fechar () {
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.modal-card {
  min-width: 320px;
  max-width: 520px;
  width: 92vw;
  border-radius: 16px;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 24px 32px;
  border-bottom: 3px solid $cumes-03;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;
}

.modal-title .title-icon {
  color: $cumes-04;
}

.modal-body {
  padding: 20px 24px;
}

.share-modal__conteudo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-modal__titulo {
  font-weight: 800;
  color: $offwhite;
}

.share-modal__texto {
  color: rgba($offwhite, 0.9);
  line-height: 1.4;
  white-space: pre-wrap;
}

.share-modal__url-wrapper {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba($offwhite, 0.12);
  background: rgba($offwhite, 0.03);
}

.share-modal__url-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba($offwhite, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.share-modal__url {
  font-size: 13px;
  color: $offwhite;
  word-break: break-word;
  line-height: 1.4;
}

.modal-actions {
  padding: 16px 24px 24px;
}

.modal-actions__right {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.btn-modal-acao {
  font-weight: 700 !important;
  border-radius: 10px !important;
  border: 1px solid rgba($cumes-03, 0.5) !important;
  color: $cumes-03 !important;
  background: rgba($cumes-03, 0.06) !important;
  padding: 8px 14px !important;

  &:hover {
    background: rgba($cumes-03, 0.12) !important;
  }
}

.btn-modal-fechar {
  font-weight: 600 !important;
  color: rgba($offwhite, 0.85) !important;
}
</style>

