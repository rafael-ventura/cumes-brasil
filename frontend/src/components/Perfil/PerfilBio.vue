<template>
  <div class="div-externa">
    <div class="title-box">
      <div class="titulo">Bio</div>
      <q-icon name="edit" size="20px" class="icon" @click="toggleEditMode" />
    </div>
    <div class="content-wrapper">
      <div v-if="!isEditing" class="bio-content">
        <div 
          ref="bioTextRef" 
          class="descricao-bio"
          :class="{ 'has-overflow': shouldShowVerMais }"
        >
          {{ fullBio }}
        </div>
        <q-btn
          v-if="shouldShowVerMais"
          flat
          dense
          no-caps
          label="Ver mais"
          icon="expand_more"
          class="btn-ver-mais"
          @click="toggleModal"
        />
      </div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input" outlined/>
    </div>
    <div v-if="isEditing" class="actions-wrapper">
      <q-btn flat label="Cancelar" class="btn-secondary" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-primary" @click="saveBio" />
    </div>

    <!-- Modal para Bio Completa -->
    <q-dialog v-model="isModalOpen" @hide="isModalOpen = false">
      <q-card class="bio-modal-card">
        <q-card-section class="bio-modal-header">
          <div class="bio-modal-title">
            <q-icon name="person" size="24px" class="title-icon" />
            <span>Biografia</span>
          </div>
        </q-card-section>

        <q-card-section class="bio-modal-body">
          <div class="bio-modal-text">{{ fullBio }}</div>
        </q-card-section>

        <q-card-actions align="right" class="bio-modal-actions">
          <q-btn
            flat
            label="Fechar"
            class="btn-close-modal"
            v-close-popup
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import UserService from 'src/services/UsuarioService';
import { IUsuario } from 'src/models/IUsuario';

const props = defineProps<{ user?: IUsuario | null }>();
const emits = defineEmits(['bio-updated']);

const isEditing = ref(false);
const newBio = ref<string>(props.user?.biografia || '');
const isModalOpen = ref(false);
const bioTextRef = ref<HTMLElement | null>(null);
const shouldShowVerMais = ref(false);

const fullBio = computed(() => props.user?.biografia || 'Nenhuma biografia disponível.');

const checkIfTextOverflows = () => {
  nextTick(() => {
    if (bioTextRef.value) {
      // Verifica se o texto está sendo truncado (scrollHeight > clientHeight)
      shouldShowVerMais.value = bioTextRef.value.scrollHeight > bioTextRef.value.clientHeight;
    }
  });
};

onMounted(() => {
  checkIfTextOverflows();
});

onUpdated(() => {
  checkIfTextOverflows();
});

watch(() => props.user?.biografia, () => {
  checkIfTextOverflows();
});

watch(() => isEditing.value, () => {
  if (!isEditing.value) {
    checkIfTextOverflows();
  }
});

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    newBio.value = props.user?.biografia || '';
    isModalOpen.value = false; // Fecha modal se estiver aberto
  }
};

const cancelEdit = () => {
  newBio.value = props.user?.biografia || '';
  isEditing.value = false;
};

const saveBio = async () => {
  try {
    const bio = newBio.value?.trim() || '';
    await UserService.editarBio(bio);
    emits('bio-updated', newBio.value);
    isEditing.value = false;
  } catch (error) {
    console.error(error);
  }
};

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.title-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 8px 0;
  background-color: transparent;
  height: auto;
  width: 100%;
  border-bottom: 2px solid rgba($cumes-03, 0.3);
  margin-bottom: 12px;
}
.titulo {
  color: $cumes-03;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon{
  color: $cumes-03;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: $cumes-01;
    transform: scale(1.15);
  }
}
.descricao-bio{
  padding: 0;
  border-radius: 12px;
  color: $offwhite;
  background-color: transparent;
  border: none;
  font-size: 15px;
  line-height: 1.6;
  min-height: auto;
  text-align: left;
  max-height: 120px; // Limita altura para ocupar espaço do card
  overflow: hidden;
  position: relative;
  word-wrap: break-word;
  
  // Desktop: altura maior para ocupar mais espaço
  @media (min-width: 1024px) {
    max-height: 150px;
  }
  
  // Gradiente no final quando há overflow para indicar que há mais texto
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, transparent, $background);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  // Mostra gradiente quando há botão "Ver mais"
  &.has-overflow::after {
    opacity: 1;
  }
}
.custom-input{
  background-color: transparent;
  border: 2px solid $cumes-01;
  border-radius: 12px;
  width: 100%;

  :deep(.q-field__control) {
    background-color: transparent;
    padding: 0 !important;
    min-height: auto;
  }

  :deep(.q-field__native) {
    color: $offwhite;
    font-size: 15px;
    font-weight: 500;
    min-height: 80px;
    padding: 12px !important;
    text-align: left !important;
    background-color: transparent;
  }

  :deep(textarea) {
    color: $offwhite;
    line-height: 1.6;
    padding: 12px !important;
    text-align: left !important;
    width: 100%;
    resize: vertical;
    background-color: transparent;
  }

  :deep(textarea::placeholder) {
    color: rgba($offwhite, 0.5);
    text-align: left !important;
  }

  &:deep(.q-field--focused) {
    border-color: $cumes-03;

    .q-field__control {
      background-color: transparent;
    }
  }
}

.div-externa{
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: auto;
}

.bio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
}

.btn-ver-mais {
  align-self: flex-start;
  color: $cumes-03 !important;
  font-weight: 600;
  font-size: 12px;
  padding: 2px 6px;
  margin-top: 0;
  min-height: auto;
  height: auto;
  
  :deep(.q-btn__content) {
    gap: 3px;
    padding: 0;
  }
  
  :deep(.q-icon) {
    color: $cumes-03 !important;
    font-size: 16px;
  }
  
  :deep(.q-btn__label) {
    font-size: 12px;
  }
  
  &:hover {
    background: rgba($cumes-03, 0.1);
  }
  
  // Desktop: ainda menor
  @media (min-width: 1024px) {
    font-size: 13px;
    padding: 3px 8px;
    
    :deep(.q-icon) {
      font-size: 18px;
    }
    
    :deep(.q-btn__label) {
      font-size: 13px;
    }
  }
}

// Modal de Bio
.bio-modal-card {
  min-width: 320px;
  max-width: 600px;
  width: 90vw;
  border-radius: 16px;
  background-color: $background;
  border: 2px solid $cumes-03;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 500px;
    max-width: 500px;
  }
}

.bio-modal-header {
  background: linear-gradient(135deg, $cumes-03 0%, darken($cumes-03, 8%) 100%);
  padding: 20px 24px;
  border-bottom: 3px solid $cumes-01;
}

.bio-modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: $offwhite;
  text-shadow: 0 2px 4px $text-shadow-default;
  
  .title-icon {
    color: $cumes-04;
  }
}

.bio-modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.bio-modal-text {
  color: $offwhite;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.bio-modal-actions {
  padding: 16px 24px;
  border-top: 1px solid rgba($cumes-03, 0.3);
}

.btn-close-modal {
  background: $cumes-03 !important;
  color: $offwhite !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  
  &:hover {
    background: darken($cumes-03, 10%) !important;
  }
}

.actions-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .btn-primary {
    background: $cumes-03 !important;
    color: $offwhite !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
    
    &:hover {
      background: darken($cumes-03, 10%) !important;
    }
  }
  
  .btn-secondary {
    background: transparent !important;
    color: $cumes-03 !important;
    border: 2px solid $cumes-03 !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
    
    &:hover {
      background: rgba($cumes-03, 0.1) !important;
    }
  }
}

// Desktop: Centralizar melhor e reduzir altura
@media (min-width: 1024px) {
  .div-externa {
    justify-content: center;
    padding: 2px 0;
  }

  .content-wrapper {
    justify-content: flex-start;
    align-items: stretch;
    margin: 0;
    width: 100%;
  }

  .descricao-bio {
    text-align: left;
    max-width: 100%;
    margin: 0;
  }

  .title-box {
    padding: 0 0 6px 0;
    margin-bottom: 8px;
  }

  .actions-wrapper {
    margin-top: 8px;
  }

  .custom-input {
    width: 100%;
    
    :deep(.q-field__control) {
      width: 100%;
      background-color: transparent;
    }

    :deep(.q-field__native) {
      min-height: 70px;
      padding: 10px 12px !important;
      text-align: left !important;
      width: 100%;
      background-color: transparent;
    }

    :deep(textarea) {
      padding: 10px 12px !important;
      text-align: left !important;
      width: 100%;
      background-color: transparent;
    }
  }
}

// Mobile: Ajustar padding e proporções
@media (max-width: 1023px) {
  .div-externa {
    padding: 4px 0;
  }

  .title-box {
    padding: 0 0 10px 0;
    margin-bottom: 12px;
  }

  .descricao-bio {
    font-size: 14px;
    line-height: 1.5;
  }

  .actions-wrapper {
    margin-top: 12px;
  }
}
</style>
