<template>
  <q-page>
    <q-btn icon="settings" class="settings-btn" @click="isConfigDialogOpen = true" />
    <PerfilBar :user="<Usuario>user" />
    <q-card class="q-pa-md q-mb-md no-wrap top-margem shadow-item border-radius-large">
      <div class="row q-col-gutter-sm q-gutter-md justify-center">
        <div v-for="(item, index) in items" :key="index" class="col-xs-5 col-sm-3 col-md-3 col-lg-2 col-xl-2">
          <q-item flat :label="item.label" clickable :to="item.to" class="shadow-item box-item">
            <q-item-section class="q-column items-center text-center">
              <div class="row items-center justify-center">
                <div :style="{ color: item.color }" class="large-text">{{ item.num }}</div>
                <q-icon :color="item.color" :name="item.icon" class="large-icon left-margem" />
              </div>
              <div class="text-h5" :style="{ color: item.color }">{{ item.label }}</div>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="isConfigDialogOpen">
      <q-card>
        <q-list>
          <q-item flat label="Editar Dados" clickable @click="openEditDialog()">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Dados</q-item-section>
          </q-item>
          <q-item flat label="Logout" clickable @click="logout">
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

const router = useRouter();
const user = ref<Usuario | null>(null);
const numColecoes = ref(0);
const numEscaladas = ref(0);
const numFavoritas = ref(0);
const colecaoId = ref(0);
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);

const items = computed(() => [
  { label: 'Escaladas', num: numEscaladas.value, icon: 'hiking', color: 'blue', to: '/escaladas' },
  { label: 'Coleções', num: numColecoes.value, icon: 'style', color: 'purple', to: '/colecoes' },
  { label: 'Favoritas', num: numFavoritas.value, icon: 'star', color: 'orange', to: `/colecoes/${colecaoId.value}` },
  { label: 'Nova Escalada', num: null, icon: 'add_location', color: 'green', to: '/colecoes' }
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
<style scoped>
.settings-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 50px;
  color: #af8355;
  background-color: #fcbd7b;
}

.large-text {
  font-size: 42px; /* Ajuste o tamanho conforme necessário */
  font-weight: bold; /* Opcional: para deixar o texto mais destacado */
}

.box-item {
  display: flex; /* Torna o item um contêiner flexível */
  align-items: center; /* Alinha o conteúdo verticalmente no centro */
  justify-content: center; /* Alinha o conteúdo horizontalmente no centro */
  height: 100%; /* Faz com que o item ocupe toda a altura disponível da coluna */
}

.q-card {
  background-color: #96c589;
}

</style>
