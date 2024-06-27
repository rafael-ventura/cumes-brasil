<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-10">
        <div class="profile-header q-pa-md q-mb-md row justify-between">
          <div class="col">
            <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
                 class="profile-picture"/>
          </div>
          <div class="col">
            <div class="text-h5">{{ user?.nome }}</div>
            <div class="text-h5">{{ user?.email }}</div>
          </div>
        </div>
        <div class="q-pa-md q-mb-md">
          <q-btn class="text-h6" label="12 Escaladas" to="/escaladas" />
          <q-btn class="text-h6" :label="`${numColecoes} Coleções`" to="/colecoes" />
        </div>
      </div>
    </div>
    <q-btn icon="settings" @click="isConfigDialogOpen = true" class="fixed-top-right"/>
    <q-dialog v-model="isConfigDialogOpen">
      <q-card>
        <q-card-section>
          <q-btn flat label="Editar Dados" @click="openEditDialog"/>
          <q-btn flat label="Logout" color="negative" @click="logout"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditarForm :user="<Usuario>user" title="Editar Perfil" submitLabel="Salvar" @submit="updateUser"/>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "src/services/UserService";
import ColecaoService from "src/services/ColecaoService";
import AuthenticateService from "src/services/AuthenticateService";
import PerfilEditarForm from "components/Perfil/PerfilEditaForm.vue";
import { Usuario } from "src/models/Usuario";

const router = useRouter();
const user = ref<Usuario | null>(null);
const numColecoes = ref(0);
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);

defineOptions({
  name: "PerfilPage"
});

onMounted(async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      await router.push("/auth/login");
    } else {
      user.value = await UserService.getPerfil();
      const colecoes = await ColecaoService.getColecaoByUsuarioId();
      numColecoes.value = colecoes.length;
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
}

.profile-header {
  padding: 16px;
  display: flex;
  align-items: center;
  background-color: #b7d5dc;
  border-radius: 40px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.fixed-top-right {
  position: fixed;
  top: 16px;
  right: 16px;
}

.rigthText{
  margin-left: 50%;
}
</style>
