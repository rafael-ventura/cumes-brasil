<template>
  <div class="q-pa-md q-mb-md no-wrap top-margem fundo1 border-radius-large">
    <div class="row title-box border-radius-medium">
      <div class="text-h5 titulo">Predileta</div>
      <q-icon name="edit" class="medium-icon right-margem icon" @click="toggleEditMode"/>
    </div>
    <q-separator spaced />

    <!-- Novo contêiner para alinhamento -->
    <div class="col text-left predileta-div">
      <div v-if="viaPreferida">
        <ViaCardSmall :via="viaPreferida" @click="goToViaDetalhada" />
      </div>
      <q-card-section v-else>
        <div class="text-h6">Nenhuma predileta adicionada.</div>
      </q-card-section>
    </div>
    <br/>
    <div>
      <q-dialog v-model="isModalSelect">
        <PerfilEditaFormAddPrediletaModal :viaPreferidaId="viaPreferidaId || ''" @viaPreferidaUpdate="viaPreferidaUpdate" />
      </q-dialog>
      <div v-if="staySaved">
        <q-btn flat label="Cancelar" class="btn-dark left-margem right-margem" @click="cancelEdit" />
        <q-btn flat label="Salvar" class="btn-dark" @click="savePreferida" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IUsuario } from 'src/models/IUsuario';
import ViaCardSmall from 'components/Via/ViaCardSmall.vue';
import { ref, watch } from 'vue';
import PerfilEditaFormAddPrediletaModal from 'components/Perfil/PerfilEditaFormAddPrediletaModal.vue';
import { Via } from 'src/models/Via';
import UsuarioService from 'src/services/UsuarioService';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{ user?: IUsuario | null }>();
const emits = defineEmits(['submit', 'waiting']);

const localUser = ref<IUsuario | null>(props.user ? { ...props.user } : null);
const viaPreferida = ref<Via | null>(localUser.value?.via_preferida || null);
const viaPreferidaId = ref<string | null>(localUser.value?.via_preferida?.id.toString() || null);
const isModalSelect = ref(false);
const staySaved = ref(false);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      localUser.value = { ...newUser };
      viaPreferida.value = newUser.via_preferida || null;
      viaPreferidaId.value = newUser.via_preferida?.id.toString() || null;
    }
  },
  { immediate: true }
);

const cancelEdit = () => {
  staySaved.value = false;
  isModalSelect.value = false;
  viaPreferida.value = localUser.value?.via_preferida || null; // Mantem preferida antiga se for cancelado
};

const toggleEditMode = () => {
  isModalSelect.value = !isModalSelect.value;
};

const goToViaDetalhada = () => {
  if (viaPreferida.value) {
    router.push({ name: 'ViaDetalhada', params: { id: viaPreferida.value.id.toString() } });
  }
};

const viaPreferidaUpdate = (newPreferida: Via) => {
  viaPreferida.value = newPreferida;
  staySaved.value = true;
  isModalSelect.value = false;
};

const savePreferida = async () => {
  try {
    if (!viaPreferida.value) {
      console.error('Nenhuma via predileta selecionada.');
      return;
    }

    const formData = new FormData();
    formData.append('via_preferida_id', viaPreferida.value.id.toString());

    // Chamada para o serviço de usuário para salvar a via preferida
    const updatedUser = await UsuarioService.editarDados(formData);
    emits('submit', updatedUser);
    staySaved.value = false;
  } catch (error) {
    console.error('Erro ao salvar a via preferida:', error);
  }
};

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
  margin-left: 5px;
  color: $cumes-03;
}
.icon{
  color: $background;
  background-color: $cumes-03;
  border-radius: 5px;
  margin-left: 20px;
}
.right-margem {
  margin-right: 16px;
}
.custom-input{
  border-radius: 10px;
  font-size: 20px;
  color: white;
}

.imagem-via-predileta{
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 10px solid $background;
  object-fit: cover;
}

.predileta-div {
  padding: 15px;
  border-radius: 10px;
  color: white;
  background-color: $background;
  border: 2px solid $cumes-03;
}

</style>
