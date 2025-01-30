<template>
  <div class="div-externa">
    <div class="row title-box border-radius-small">
      <div class="text-h5 titulo">Bio</div>
      <q-icon name="edit" class="small-icon right-margem icon" @click="toggleEditMode" />
    </div>
    <q-separator spaced />
    <div class="col text-left">
      <div v-if="!isEditing" class="text-h6 descricao-bio">{{ displayedBio }}</div>
      <q-input v-else v-model="newBio" type="textarea" class="custom-input" outlined/>
    </div><br/>
    <div v-if="isEditing">
      <q-btn flat label="Cancelar" class="btn-secondary left-margem right-margem" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-primary" @click="saveBio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UserService from 'src/services/UsuarioService';
import { IUsuario } from 'src/models/IUsuario';

const props = defineProps<{ user?: IUsuario | null }>();
const emits = defineEmits(['bio-updated']);

const isEditing = ref(false);
const newBio = ref<string>(props.user?.biografia || '');

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    newBio.value = props.user?.biografia || ''; // Aqui você garante que `newBio` tenha o valor atual de `bio` quando inicia a edição
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

const displayedBio = computed(() => props.user?.biografia || 'Nenhuma biografia disponível.');
</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.title-box{
  padding-top: 10px;
  background-color: $background;
  height: 50px;
  width: max-content;
}
.titulo {
  color: $cumes-03;
}
.icon{
  color: $cumes-03;
  margin-left: 0.8rem;
}
.descricao-bio{
  padding: 15px;
  border-radius: 10px;
  color: white;
  background-color: $background;
  border: 2px solid $cumes-03;
}
.right-margem {
  margin-right: 16px;
}
.custom-input{
  background-color: $background;
  border: 5px solid $cumes-03;
  border-radius: 10px;
  font-size: 20px;
  color: white;
}

.div-externa{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
