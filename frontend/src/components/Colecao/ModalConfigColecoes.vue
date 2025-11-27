<template>
  <q-dialog :model-value="modelValue" @update:model-value="handleClose">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="edit" size="28px" class="title-icon" />
          <span>Editar Coleção</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-form @submit.prevent="emitEdit" class="edit-form">
          <div class="form-field">
            <label class="field-label">Nome da Coleção *</label>
            <q-input
              v-model="collectionName"
              class="custom-input"
              outlined
              dense
              lazy-rules
              :rules="[ val => !!val || 'Campo obrigatório' ]"
            />
          </div>

          <div class="form-field">
            <label class="field-label">Descrição da Coleção</label>
            <q-input
              v-model="collectionDescription"
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
              label="Salvar Alterações" 
              icon="save"
              class="btn-primary-custom"
              unelevated
              no-caps
            />
            <q-btn 
              label="Fechar" 
              class="btn-secondary-custom"
              unelevated
              no-caps
              @click="handleClose"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  collectionData: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update:modelValue', 'edit']);

const collectionName = ref(props.collectionData?.nome || '');
const collectionDescription = ref(props.collectionData?.descricao || '');

watch(() => props.collectionData, (newData) => {
  if (newData) {
    collectionName.value = newData.nome || '';
    collectionDescription.value = newData.descricao || '';
  }
}, { immediate: true, deep: true });

const handleClose = () => {
  emits('update:modelValue', false);
};

const emitEdit = () => {
  if (collectionName.value.trim()) {
    emits('edit', {
      nome: collectionName.value,
      descricao: collectionDescription.value
    });
    handleClose();
  }
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

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
