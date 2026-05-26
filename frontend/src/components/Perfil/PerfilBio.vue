<template>
  <div class="div-externa">
    <div class="title-box">
      <div class="titulo">Bio</div>
      <i v-if="!readonly" class="pi pi-pencil icon" @click="toggleEditMode" />
    </div>
    <div class="content-wrapper">
      <div v-if="!isEditing || readonly" class="bio-content">
        <div
          ref="bioTextRef"
          class="descricao-bio"
          :class="{ 'has-overflow': shouldShowVerMais && !bioExpandida, 'bio-expandida': bioExpandida }"
        >
          {{ fullBio }}
        </div>
        <button v-if="shouldShowVerMais" class="btn-ver-mais" @click="toggleExpandirBio">
          <i :class="bioExpandida ? 'pi pi-angle-up' : 'pi pi-angle-down'" />
          {{ bioExpandida ? 'Ver menos' : 'Ver mais' }}
        </button>
      </div>
      <textarea v-else v-model="newBio" class="bio-textarea" rows="4" placeholder="Escreva sua bio..." />
    </div>
    <div v-if="isEditing && !readonly" class="actions-wrapper">
      <Button label="Cancelar" class="btn-secondary" text @click="cancelEdit" />
      <Button label="Salvar" class="btn-primary" @click="saveBio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import UserService from 'src/services/UsuarioService';
import { IUsuario } from 'src/models/IUsuario';
import Button from 'primevue/button';

const props = defineProps<{ user?: IUsuario | null; readonly?: boolean }>();
const emits = defineEmits(['bio-updated']);

const isEditing = ref(false);
const newBio = ref<string>(props.user?.biografia || '');
const bioTextRef = ref<HTMLElement | null>(null);
const shouldShowVerMais = ref(false);
const bioExpandida = ref(false);

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
  bioExpandida.value = false;
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
    bioExpandida.value = false;
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

const toggleExpandirBio = () => {
  bioExpandida.value = !bioExpandida.value;
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.title-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 4px 0;
  background-color: transparent;
  height: auto;
  width: 100%;
  border-bottom: 1px solid rgba($cumes-03, 0.25);
  margin-bottom: 6px;
}
.titulo {
  color: $cumes-03;
  font-weight: 700;
  font-size: 13px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.02em;
}
.icon {
  font-size: 16px;
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
  border-radius: 0;
  color: rgba($offwhite, 0.88);
  background-color: transparent;
  border: none;
  font-size: 12px;
  line-height: 1.5;
  min-height: auto;
  text-align: left;
  max-height: 54px;
  overflow: hidden;
  position: relative;
  word-wrap: break-word;

  @media (min-width: 1024px) {
    max-height: 66px;
    font-size: 13px;
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

  &.bio-expandida {
    max-height: none;
    overflow: visible;

    &::after {
      opacity: 0 !important;
    }
  }
}
.bio-textarea {
  width: 100%;
  background: transparent;
  border: 2px solid $cumes-01;
  border-radius: 12px;
  color: $offwhite;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  padding: 10px 12px;
  resize: vertical;
  min-height: 80px;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: rgba($offwhite, 0.45);
  }

  &:focus {
    border-color: $cumes-03;
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  background: transparent;
  border: none;
  color: $cumes-03;
  font-weight: 600;
  font-size: 12px;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 6px;

  i {
    font-size: 14px;
  }

  &:hover {
    background: rgba($cumes-03, 0.1);
  }
}

.actions-wrapper {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  .btn-primary {
    background: $cumes-03 !important;
    color: $offwhite !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    padding: 7px 18px !important;
    font-size: 14px !important;
    border: none !important;

    &:hover {
      opacity: 0.88;
    }
  }

  .btn-secondary {
    color: $cumes-03 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 7px 12px !important;

    &:hover {
      background: rgba($cumes-03, 0.08) !important;
    }
  }
}

// Desktop
@media (min-width: 1024px) {
  .div-externa {
    justify-content: flex-start;
    padding: 0;
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

  .bio-textarea {
    width: 100%;
    min-height: 70px;
  }
}

// Mobile: Ajustar padding e proporções
@media (max-width: 1023px) {
  .div-externa {
    padding: 2px 0;
  }

  .title-box {
    padding: 0 0 4px 0;
    margin-bottom: 6px;
  }

  .descricao-bio {
    font-size: 12px;
    line-height: 1.45;
  }

  .actions-wrapper {
    margin-top: 8px;
  }
}
</style>
