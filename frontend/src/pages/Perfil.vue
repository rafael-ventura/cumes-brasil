<template>
  <q-page class="q-pa-md profile-page">
    <div class="profile-header-container">
      <div class="profile-header row no-wrap justify-between items-center q-pa-md">
        <div class="col-auto">
          <img :src="user?.foto_perfil?.url || 'https://via.placeholder.com/150'" alt="Foto de Perfil"
               class="profile-picture" @click="expandImage(user?.foto_perfil?.url || 'https://via.placeholder.com/150')"/>
        </div>
        <div class="col text-left q-ml-md">
          <div class="text-h5">{{ user?.nome }}</div>
          <div class="text-h5">{{ user?.email }}</div>
        </div>
        <q-btn icon="settings" class="settings-btn" @click="isConfigDialogOpen = true" />
      </div>
    </div>
    <div class="q-pa-md q-mb-md row no-wrap justify-center items-center">
      <q-btn class="text-h6 q-mr-md" label="12 Escaladas" to="/escaladas" />
      <q-btn class="text-h6" :label="`${numColecoes} Coleções`" to="/colecoes" />
    </div>
    <q-dialog v-model="isConfigDialogOpen">
      <q-card>
        <q-card-section>
          <q-btn flat label="Editar Dados" @click="openEditDialog"/>
          <q-btn flat label="Logout" color="negative" @click="logout"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditarForm :user="<Usuario>user" title="Editar Perfil" submitLabel="Salvar" @submit="updateUser" />
    </q-dialog>
    <!-- Diálogo para imagem expandida -->
    <q-dialog v-model="isImageModalOpen">
      <q-card>
        <q-card-section class="q-pa-none">
          <img :src="expandedImageUrl" alt="Imagem expandida" class="full-width full-height" />
        </q-card-section>
      </q-card>
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
import { dom } from "quasar";
import width = dom.width;

const router = useRouter();
const user = ref<Usuario | null>(null);
const numColecoes = ref(0);
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);
const isImageModalOpen = ref(false);
const expandedImageUrl = ref("");

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

const expandImage = (url: string) => {
  expandedImageUrl.value = url;
  isImageModalOpen.value = true;
};
</script>

<style scoped>
.profile-page {
  padding: 0 !important;
}

.profile-header-container {
  background-color: #b7d5dc;
  padding: 16px;
  border-radius: 0 0 26px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.profile-header {
  width: 100%;
  position: relative;
}

.settings-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
