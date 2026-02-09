<template>
  <div class="div-externa">
    <div class="title-box">
      <div class="titulo">Via Predileta</div>
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
    
    <PerfilEditaFormAddPrediletaModal 
      v-model="isModalSelect"
      :viaPreferidaId="viaPreferidaId || ''" 
      @viaPreferidaUpdate="viaPreferidaUpdate" 
    />
  </div>
</template>

<script setup lang="ts">
import { IUsuario } from 'src/models/IUsuario';
import ViaCardSmall from 'components/Via/ViaCardSmall.vue';
import { watch, ref } from 'vue';
import PerfilEditaFormAddPrediletaModal from 'components/Perfil/PerfilEditaFormAddPrediletaModal.vue';
import { Via } from 'src/models/Via';
import UsuarioService from 'src/services/UsuarioService';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{ user?: IUsuario | null }>();
const emits = defineEmits(['submit', 'waiting']);

const localUser = ref<IUsuario | null>(props.user ? { ...props.user } : null);
const viaPreferida = ref<Via | null>(props.user?.via_preferida || null);
const viaPreferidaId = ref<string | null>(props.user?.via_preferida?.id?.toString() || null);
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
  savePreferida();
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
    await UsuarioService.editarDados(formData);
    
    // Buscar o perfil novamente para ter os dados completos com relações (montanha, imagem)
    const updatedUser = await UsuarioService.getPerfil();
    
    // Atualizar o estado local com a via predileta completa
    if (updatedUser && updatedUser.via_preferida) {
      viaPreferida.value = updatedUser.via_preferida;
      viaPreferidaId.value = updatedUser.via_preferida.id?.toString() || null;
      localUser.value = updatedUser;
    }
    
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
  padding: 0 0 8px 0;
  background-color: transparent;
  height: auto;
  width: 100%;
  border-bottom: 2px solid rgba($cumes-01, 0.3);
  margin-bottom: 12px;
}
.titulo {
  color: $cumes-01;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon{
  color: $cumes-01;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: $cumes-03;
    transform: scale(1.15);
  }
}

.div-externa{
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: auto;
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
  padding: 24px 16px;
  gap: 12px;
  min-height: auto;
  flex: 1;
  
  .q-icon {
    color: $cumes-01;
    opacity: 0.5;
  }
}

.empty-text {
  color: $offwhite;
  font-size: 15px;
  opacity: 0.7;
  text-align: center;
}

.actions-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .btn-primary {
    background: $cumes-01 !important;
    color: $offwhite !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
    
    &:hover {
      background: darken($cumes-01, 10%) !important;
    }
  }
  
  .btn-secondary {
    background: transparent !important;
    color: $cumes-01 !important;
    border: 2px solid $cumes-01 !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    padding: 8px 20px !important;
    
    &:hover {
      background: rgba($cumes-01, 0.1) !important;
    }
  }
}

// Desktop: Centralizar melhor e reduzir altura
@media (min-width: 1024px) {
  .div-externa {
    justify-content: center;
    padding: 2px 0;
  }

  .content-wrapper {
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .via-card-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }

  .empty-state {
    padding: 10px 16px;
    min-height: auto;
    gap: 6px;
  }

  .title-box {
    padding: 0 0 6px 0;
    margin-bottom: 8px;
  }

  .actions-wrapper {
    margin-top: 8px;
  }
}

// Mobile: Ajustar padding e proporções
@media (max-width: 1023px) {
  .div-externa {
    padding: 4px 0;
  }

  .title-box {
    padding: 0 0 10px 0;
    margin-bottom: 12px;
  }

  .empty-state {
    padding: 20px 12px;
    gap: 10px;
  }

  .empty-text {
    font-size: 14px;
  }

  .actions-wrapper {
    margin-top: 12px;
  }
}
</style>
