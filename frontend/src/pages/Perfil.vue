<template>
  <q-page>
    <q-btn icon="settings" class="settings-btn" @click="isConfigDialogOpen = true" />
    <PerfilBar :user="<Usuario>user" />
    <PerfilGridButtons :items="items" />
    <q-dialog v-model="isConfigDialogOpen">
      <q-card class="card-config">
        <q-list>
          <q-item flat label="Editar Dados" clickable @click="openEditDialog()" class="btn">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Dados</q-item-section>
          </q-item>
          <q-item flat label="Logout" clickable @click="logout" class="btn">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditaForm v-if="user" :user="<Usuario>user" @submit="handleEditSubmit" />
    </q-dialog>
    <PerfilBio :user="<Usuario>user" @bio-updated="updateUserBio" />
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';
import PerfilEditaForm from 'components/Perfil/PerfilEditaForm.vue';
import { Usuario } from 'src/models/Usuario';
import PerfilBar from 'components/Perfil/PerfilBar.vue';
import PerfilBio from 'components/Perfil/PerfilBio.vue';
import PerfilGridButtons from 'components/Perfil/PerfilGridButtons.vue';

const router = useRouter();
const user = ref<Usuario | null>(null);
const numColecoes = ref(0);
const numEscaladas = ref(0);
const numFavoritas = ref(0);
const colecaoId = ref(0);
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);

const items = computed(() => [
  { label: 'Escaladas', num: numEscaladas.value, icon: 'hiking', color: '#EF9D9D', to: '/escaladas' },
  { label: 'Coleções', num: numColecoes.value, icon: 'style', color: '#BCE9B4', to: '/colecoes' },
  { label: 'Favoritas', num: numFavoritas.value, icon: 'star', color: '#7E9CE8', to: `/colecoes/${colecaoId.value}` }
]);

onMounted(async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      await router.push('/auth/login');
    } else {
      user.value = await UserService.getPerfil();
      const colecoes = await ColecaoService.getByUsuarioId();
      const favorita = colecoes.filter((colecao) => colecao.nome === 'Vias Favoritas');
      colecaoId.value = favorita[0].id;
      const colecaoFavoritas = await ColecaoService.getViasIn(colecaoId.value);
      numFavoritas.value = colecaoFavoritas.length;
      numColecoes.value = colecoes.length;
    }
  } catch (error) {
    console.error(error);
  }
});

const logout = () => {
  UserService.logout();
  router.push('/auth/login');
};

const openEditDialog = () => {
  isConfigDialogOpen.value = false;
  isEditDialogOpen.value = true;
};

const handleEditSubmit = async () => {
  try {
    user.value = await UserService.getPerfil(); // Atualiza o estado local com o perfil atualizado;
    isEditDialogOpen.value = false; // Fecha o modal de edição
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
  }
};

const updateUserBio = (newBio: string) => {
  if (user.value) {
    user.value.biografia = newBio;
  }
};

defineOptions({
  name: 'PerfilPage'
});
</script>
<style scoped lang="scss">
@import "src/css/app.scss";
.settings-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 50px;
  color: $dark;
  background-color: $primary;
}
.card-config{
  background-color: $primary-light;
}
</style>
