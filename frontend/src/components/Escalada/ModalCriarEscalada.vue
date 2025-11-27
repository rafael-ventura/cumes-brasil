<template>
  <q-dialog :model-value="props.isOpen" @update:model-value="handleClose">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="add_circle" size="28px" class="title-icon" />
          <span>Registrar Escalada</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-form @submit.prevent="onSubmit" @reset="onReset" class="edit-form">
          <div class="form-field">
            <label class="field-label">Data da Escalada *</label>
            <q-input
              v-model="data"
              class="custom-input"
              outlined
              dense
              mask="##-##-####"
              lazy-rules
              :rules="[ val => !!val || 'Campo obrigatório' ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="data" mask="DD-MM-YYYY" bordered/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="form-field">
            <label class="field-label">Observação</label>
            <q-input
              v-model="observacao"
              type="textarea"
              class="custom-input"
              outlined
              dense
              rows="2"
            />
          </div>

          <div class="participantes-section">
            <div v-for="(participante, index) in participantes" :key="index" class="participante-section">
              <div class="participante-header">
                <div class="participante-title">Participante {{ index + 1 }}</div>
                <q-btn
                  v-if="participantes.length > 1"
                  icon="close"
                  flat
                  round
                  dense
                  size="sm"
                  class="remove-participante-btn"
                  @click="removeParticipante(index)"
                />
              </div>

              <div class="form-field">
                <label class="field-label">Tipo do participante *</label>
                <q-select
                  v-model="participante.tipo"
                  :options="participanteTipoOptions"
                  class="custom-select"
                  outlined
                  dense
                  :rules="[ val => !!val || 'Por favor, selecione uma opção' ]"
                />
              </div>

              <div class="form-field">
                <label class="field-label">Nome do participante *</label>
                <q-input
                  v-model="participante.nome"
                  class="custom-input"
                  outlined
                  dense
                  :rules="[ val => val !== '' || 'Nome não pode ser vazio' ]"
                />
              </div>

              <div class="form-field">
                <label class="field-label">Email do participante</label>
                <q-input
                  v-model="participante.email"
                  class="custom-input"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-btn
              icon="add"
              label="Adicionar Participante"
              class="btn-add-participante"
              @click="addParticipante"
              unelevated
              no-caps
            />
          </div>

          <div class="form-actions">
            <q-btn
              type="submit"
              label="Registrar Escalada"
              icon="save"
              class="btn-primary-custom"
              unelevated
              no-caps
            />
            <q-btn
              type="reset"
              label="Limpar"
              class="btn-secondary-custom"
              unelevated
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Escalada } from 'src/models/Escalada';
import { Participante } from 'src/models/Participante';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import { Notify } from 'quasar';
import AuthenticateService from 'src/services/AuthenticateService';

const observacao = ref('');
const route = useRoute();
const router = useRouter();

// Função para formatar data no formato DD-MM-YYYY
const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Define data padrão como hoje
const data = ref(formatDateToDDMMYYYY(new Date()));

const participantes = ref<Participante[]>([{ nome: '', tipo: '', email: '' }]);
const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{(e: 'closeModal'): void; }>();

const handleClose = () => {
  emit('closeModal');
};

const participanteTipoOptions = ['GUIA', 'PARTICIPANTE', 'MISTO'];

const addParticipante = () => {
  participantes.value.push({ nome: '', tipo: '', email: '' });
};

const removeParticipante = (index: number) => {
  if (participantes.value.length > 1) {
    participantes.value.splice(index, 1);
  }
};

const onSubmit = async () => {
  const viaId = Number(route.params.id);

  const escalada: Escalada = {
    via: viaId,
    data: convertStringToDate(data.value),
    observacao: observacao.value,
    participantes: participantes.value,
    usuario: Number(localStorage.getItem('usuarioId')) || 0
  };

  await AuthenticateService.redirecionaSeNaoAutenticado(router);
  try {
    await EscaladaService.createEscalada(escalada);
    onReset();
    Notify.create({
      type: 'positive',
      message: 'Escalada registrada com sucesso!',
      position: 'top-right',
      timeout: 3000
    });
    emit('closeModal');
  } catch (error: any) {
    const errorMessage = 'Ocorreu um erro no servidor, tente novamente mais tarde';
    Notify.create({
      type: 'negative',
      message: '' + errorMessage,
      position: 'top-right',
      timeout: 3000
    });
  }
};

const convertStringToDate = (date: string): Date => {
  const formattedDate = date.trim().split('-').reverse().join('-');
  return new Date(formattedDate);
};

const onReset = () => {
  observacao.value = '';
  data.value = formatDateToDDMMYYYY(new Date()); // Reseta para data de hoje
  participantes.value = [{ nome: '', tipo: '', email: '' }];
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

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

// Header do Card
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

// Body do Card
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

// Form Fields
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

// Custom Input Styling
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

// Custom Select Styling
.custom-select {
  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 8px !important;
    padding: 0 !important;

    &::before {
      border-color: $cumes-01 !important;
      border-width: 2px !important;
    }
  }

  :deep(.q-field__native) {
    color: $background !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  :deep(.q-field__input) {
    color: $background !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03 !important;
      border-width: 2px !important;
    }
  }
}

// Participantes Section
.participantes-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  margin-bottom: 8px;
}

.participante-section {
  padding: 12px;
  background-color: rgba($cumes-01, 0.1);
  border-radius: 8px;
  border: 1px solid rgba($cumes-01, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.participante-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.participante-title {
  font-size: 16px;
  font-weight: 700;
  color: $cumes-03;
}

.remove-participante-btn {
  color: $error-color !important;

  &:hover {
    background-color: rgba($error-color, 0.1) !important;
  }
}

.btn-add-participante {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px dashed $cumes-01 !important;
  padding: 8px 20px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  margin-top: 8px;
  min-height: 36px !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
    border-style: solid !important;
  }
}

// Form Actions
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba($cumes-03, 0.2);
}

// Custom Primary Button
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
</style>
