<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="profile-header q-pa-md q-mb-md">
          <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
               class="profile-picture"/>
          <div class="profile-info q-pa-md q-mt-md">
            <div class="text-h6">{{ user?.nome }}</div>
            <div class="text-h6">{{ user?.nome }}</div>
          </div>
        </div>
        <q-card-actions align="right" class="actions">
          <q-btn flat label="Editar Dados" @click="openEditDialog"/>
          <q-btn flat label="Logout" color="negative" @click="logout"/>
        </q-card-actions>
      </div>
    </div>

    <q-dialog v-model="isEditDialogOpen" persistent>
      <PerfilEditarForm :user="<Usuario>user" title="Editar Perfil" submitLabel="Salvar" @submit="updateUser"/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "src/services/UserService";
import AuthenticateService from "src/services/AuthenticateService";
import PerfilEditarForm from "components/Perfil/PerfilEditarForm.vue";
import { Usuario } from "src/models/Usuario";

const router = useRouter();
const user = ref<Usuario | null>(null);
const isEditDialogOpen = ref(false);

defineOptions({
  name: "PerfilPage"
});

onMounted(async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      await router.push("/auth/login");
    } else {
      user.value = await UserService.getPerfil();
    }
  } catch (error) {
    console.error(error);
  }
});

const openEditDialog = () => {
  isEditDialogOpen.value = true;
};

const logout = () => {
  UserService.logout();
  router.push("/auth/login");
};

const updateUser = async (updatedUser: Usuario) => {
  try {
    user.value = await UserService.update(updatedUser);
    isEditDialogOpen.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.profile-info {
  background-color: rgba(255, 255, 255, 0.1); /* Ajuste conforme necessário para modo escuro/claro */
  padding: 16px;
  border-radius: 8px;
}

.actions {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
