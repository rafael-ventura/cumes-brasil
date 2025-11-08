<template>
  <div class="div-externa">
    <div class="title-box">
      <div class="titulo">Predileta</div>
      <q-icon name="edit" size="20px" class="icon" @click="toggleEditMode"/>
    </div>

    <!-- Exibição dos detalhes da via favorita -->
    <div class="content-wrapper">
      <div v-if="viaPreferida" class="via-card-wrapper">
        <ViaCardSmall :via="viaPreferida" @click="goToViaDetalhada" />
      </div>
      <div v-else class="empty-state">
        <q-icon name="favorite_border" size="48px" color="grey-6" />
        <div class="empty-text">Nenhuma predileta adicionada.</div>
      </div>
    </div>
    
    <div v-if="staySaved" class="actions-wrapper">
      <q-btn flat label="Cancelar" class="btn-secondary" @click="cancelEdit" />
      <q-btn flat label="Salvar" class="btn-primary" @click="savePreferida" />
    </div>
    
    <q-dialog v-model="isModalSelect">
      <PerfilEditaFormAddPrediletaModal :viaPreferidaId="viaPreferidaId || ''" @viaPreferidaUpdate="viaPreferidaUpdate" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { IUsuario } from 'src/models/IUsuario';
import ViaCardSmall from 'components/Via/ViaCardSmall.vue';
import { watch, ref, defineEmits } from 'vue';
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
      console.error('Nenhuma via preferida selecionada.');
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 20px 0;
  background-color: transparent;
  height: auto;
  width: 100%;
  border-bottom: 2px solid rgba($cumes-03, 0.3);
  margin-bottom: 20px;
}
.titulo {
  color: $cumes-03;
  font-weight: 700;
  font-size: 22px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon{
  color: $cumes-03;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: $cumes-01;
    transform: scale(1.15);
  }
}

.div-externa{
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.via-card-wrapper {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
  min-height: 180px;
  flex: 1;
}

.empty-text {
  color: $offwhite;
  font-size: 16px;
  opacity: 0.6;
  text-align: center;
}

.actions-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
