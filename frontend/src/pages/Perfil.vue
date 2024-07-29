<template>
  <q-page>
    <q-btn icon="settings" class="settings-btn" @click="isConfigDialogOpen = true"/>
    <PerfilBar :user="<Usuario>user" class="q-pa-md"/>
    <q-card class="q-pa-md q-mb-md no-wrap">
      <div class="row q-col-gutter-sm q-gutter-md justify-center">
        <div v-for="(item, index) in items" :key="index" class="col-xs-5 col-sm-3 col-md-3 col-lg-2 col-xl-2">
          <q-item flat :label="item.label" clickable :to="item.to" class="shadow-item">
            <q-item-section class="q-column items-center text-center">
              <div class="row items-center justify-center">
                <div :style="{ color: item.color }" class="large-text">{{ item.num }}</div>
                <q-icon :color="item.color" :name="item.icon" class="large-icon"/>
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
          <q-item flat label="Editar Dados" clickable @click="isEditDialogOpen = true">
            <q-item-section avatar>
              <q-icon name="edit"/>
            </q-item-section>
            <q-item-section>Editar Dados</q-item-section>
          </q-item>
          <q-item flat label="Logout" clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative"/>
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isEditDialogOpen">
      <PerfilEditarForm :user="<Usuario>user" title="Editar Perfil" submitLabel="Salvar" @submit="updateUser"/>
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from 'src/services/UsuarioService';
import ColecaoService from 'src/services/ColecaoService';
import AuthenticateService from 'src/services/AuthenticateService';
import PerfilEditarForm from 'components/Perfil/PerfilEditaForm.vue';
import { Usuario } from 'src/models/Usuario';
import PerfilBar from 'components/Perfil/PerfilBar.vue';

const router = useRouter();
const user = ref<Usuario | null>(null);
const numColecoes = ref(0);
const numEscaladas = ref(0);
const numFavoritas = ref(0);
const isEditDialogOpen = ref(false);
const isConfigDialogOpen = ref(false);

const items = ref([
  { label: 'Escaladas', num: numEscaladas.value, icon: 'hiking', color: 'pink', to: '/escaladas' },
  { label: 'Coleções', num: numColecoes.value, icon: 'style', color: 'blue', to: '/colecoes' },
  { label: 'Favoritas', num: numFavoritas.value, icon: 'star', color: 'green', to: '/colecoes' },
  { label: 'Da Semana', num: null, icon: 'event', color: 'orange', to: '/colecoes' },
  { label: 'Nova Escalada', num: null, icon: 'add_location', color: 'purple', to: '/colecoes' }
]);

defineOptions({
  name: 'PerfilPage'
});

onMounted(async () => {
  try {
    if (!AuthenticateService.isAuthenticated()) {
      await router.push('/auth/login');
    } else {
      user.value = await UserService.getPerfil();
      const colecoes = await ColecaoService.getByUsuarioId();
      // const escaladas = await EscaladaService.getAll();
      numColecoes.value = colecoes.length;
      // numEscaladas.value = escaladas.length;

      // Update items with the new counts
      items.value[0].num = numEscaladas.value;
      items.value[1].num = numColecoes.value;
    }
  } catch (error) {
    console.error(error);
  }
});

const logout = () => {
  UserService.logout();
  router.push('/auth/login');
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
.settings-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 50px;
}

.large-icon {
  font-size: 56px; /* Ajuste o tamanho conforme necessário */
  margin-left: 8px; /* Espaçamento entre o valor numérico e o ícone */
}

.large-text {
  font-size: 42px; /* Ajuste o tamanho conforme necessário */
  font-weight: bold; /* Opcional: para deixar o texto mais destacado */
}

.shadow-item {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* Ajuste os valores conforme necessário */
  display: flex; /* Torna o item um contêiner flexível */
  align-items: center; /* Alinha o conteúdo verticalmente no centro */
  justify-content: center; /* Alinha o conteúdo horizontalmente no centro */
  height: 100%; /* Faz com que o item ocupe toda a altura disponível da coluna */
}

</style>
