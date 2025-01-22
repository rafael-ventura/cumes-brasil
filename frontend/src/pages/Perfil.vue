<template>
  <q-page>
    <!-- Botão de Configuração -->
    <q-btn icon="settings" class="settings-btn" @click="isConfigDialogOpen = true" />

    <!-- PerfilBar e PerfilGridButtons lado a lado em telas grandes -->
    <div class="row q-col-gutter-none">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
        <PerfilBar :user="user" @submit="handleEditSubmit" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-5 col-xl-4">
        <PerfilGridButtons :items="items" />
      </div>
    </div>

    <!-- Configuração do Dialog -->
    <q-dialog v-model="isConfigDialogOpen">
      <q-card class="card-config">
        <q-list>
          <q-item flat label="Editar Dados" clickable @click="openEditDialog()" class="btn">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Editar Dados</q-item-section>
          </q-item>
          <q-item flat label="Logout" clickable @click="logout" class="btn-red">
            <q-item-section avatar>
              <q-icon name="logout" class="red" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- Perfil de Edição -->
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditaForm v-if="user" :user="user" @submit="handleEditSubmit" />
    </q-dialog>

    <!-- PerfilBio e PerfilPredileta lado a lado em telas grandes -->
    <div class="row q-col-gutter-none">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 perfil-div">
        <PerfilBio :user="user" @bio-updated="updateUserBio" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 caixa2">
        <PerfilViaPredileta :user="user"  @submit="handleEditSubmit"/>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';
import PerfilEditaForm from 'components/Perfil/PerfilEditaForm.vue';
import { IUsuario } from 'src/models/IUsuario';
import PerfilBar from 'components/Perfil/PerfilBar.vue';
import PerfilBio from 'components/Perfil/PerfilBio.vue';
import { IColecao } from 'src/models/IColecao';
import PerfilGridButtons from 'components/Perfil/PerfilGridButtons.vue';
import PerfilViaPredileta from 'components/Perfil/PerfilViaPredileta.vue';
import EscaladaService from 'src/services/EscaladaService';
import { Escalada } from 'src/models/Escalada';

const router = useRouter();
const user = ref<IUsuario | undefined>(undefined);
const numColecoes = ref();
const numEscaladas = ref();
const numFavoritas = ref();
const colecaoId = ref();
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);

const items = computed(() => [
  {
    label: 'Coleções',
    num: numColecoes.value,
    icon: 'style',
    color: '#546119',
    to: '/colecoes'
  },
  {
    label: 'Favoritas',
    num: numFavoritas.value,
    icon: 'star',
    color: '#F4E285',
    to: '/favoritas'
  },
  {
    label: 'Escaladas',
    num: numEscaladas.value,
    icon: 'hiking',
    color: '#BC4B51',
    to: '/escaladas'
  }
]);

onMounted(async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      await router.push('/auth/login');
    } else {
      user.value = await UserService.getPerfil();
      const colecoes: IColecao[] | undefined = await ColecaoService.listarColecoesPorUsuario();
      const favorita: IColecao | null = await ColecaoService.obterColecaoFavoritos();
      const escaladas: Escalada[] = await EscaladaService.getEscaladasByUsuario();
      if (favorita) {
        colecaoId.value = favorita?.id;
        numFavoritas.value = favorita.viaColecoes.length;
        numColecoes.value = colecoes?.length;
      }
      if (escaladas.length === 0) {
        numEscaladas.value = 0;
      } else {
        numEscaladas.value = escaladas.length;
      }
    }
  } catch (error) {
    console.error(error);
  }
});

const updateUserBio = (newBio: string) => {
  if (user.value) {
    user.value.biografia = newBio;
    user.value = { ...user.value }; // Trigger reatividade
  }
};

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
  color: $background;
  background-color: $cumes-03;
}
.card-config{
  border-radius: 10px;
  background-color: $background;
}

.caixa1 {
  @media (min-width: 1024px) {
    padding-top: 60px;
  }
}

.perfil-div {
  @media (min-width: 1024px) {
    padding: 20px;
  }
}

</style>
