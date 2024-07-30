<template>
  <q-card class="q-pa-md q-mb-md no-wrap top-margem shadow-item border-radius-large">
    <div class="row justify-between">
      <div class="text-h5 left-margem">Bio</div>
      <q-icon name="edit" class="medium-icon right-margem" @click="isEditBioDialogOpen = true" />
    </div>
    <q-separator spaced />
    <q-card-section class="col text-left q-ml-md">
      <div class="text-h6">{{ displayedBio }}</div>
    </q-card-section>
    <q-dialog v-model="isEditBioDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Biografia</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newBio" label="Biografia" type="textarea" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="isEditBioDialogOpen = false" />
          <q-btn flat label="Salvar" color="primary" @click="saveBio" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed, defineEmits } from 'vue';
import { Usuario } from 'src/models/Usuario';
import UserService from 'src/services/UsuarioService';

const props = defineProps<{ user: Usuario }>();
const emits = defineEmits(['bio-updated']); // Defina o evento emitido

const isEditBioDialogOpen = ref(false);
const newBio = ref('');

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      newBio.value = newVal.biografia || '';
    }
  },
  { immediate: true }
);

const saveBio = async () => {
  try {
    await UserService.editarBio(newBio.value);
    emits('bio-updated', newBio.value); // Emita o evento com a nova biografia
    isEditBioDialogOpen.value = false;
  } catch (error) {
    console.error(error);
  }
};

const displayedBio = computed(() => props.user?.biografia || 'Nenhuma biografia disponível.');
</script>

<style scoped>
.left-margem {
  margin-left: 16px;
}
.right-margem {
  margin-right: 16px;
}
</style>
