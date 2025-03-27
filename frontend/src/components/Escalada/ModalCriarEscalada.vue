<template>
  <div v-if="props.isOpen" class="modal-overlay">
    <div class="card-style">
      <div class="header-section">
        <div class="title">Criar Escalada</div>
        <Button icon="pi pi-times" class="p-button-rounded p-button-text" @click="emit('closeModal')" />
      </div>

      <form @submit="onSubmit" @reset="onReset" class="form-container">

        <!-- Campo Data da Escalada -->
        <div class="custom-input-auth">
          <div class="input-container">
            <i class="pi pi-calendar input-icon"></i>
            <label for="data" class="input-label">Data da Escalada</label>
          </div>
          <DatePicker id="data" v-model="data" :invalid="!data" class="custom-input-field"
            placeholder="Selecione a data" :maxDate="new Date()" :manualInput="false" dateFormat="dd/mm/yy" />
        </div>

        <!-- Campo de Text Field para Observação -->
        <InputText label-color="primary" filled v-model="observacao" label="Alguma observação?" type="textarea"
          class="input p-inputtext-label-primary" />

        <!-- Input para definir a quantidade de participantes na Escalada -->
        <InputText filled type="number" v-model.number="qtdParticipantes" label="Quantos participantes na escalada?"
          label-color="primary" color="primary" min="1"
          :rules="[val => val > 0 || 'Participante não pode ser menor que zero']"
          class="input p-inputtext-label-primary" @input="onQtdParticipantesChange" />

        <div v-for="(participante, index) in participantes" :key="index" class="participante-section">
          <h5 class="participante-title">Participante {{ index + 1 }}</h5>

          <!-- Campo de Seleção para Tipo de Participante -->
          <Dropdown filled v-model="participante.tipo" label="Tipo do participante" label-color="primary"
            color="primary" :options="participanteTipoOptions" class="input"
            :rules="[val => !!val || 'Por favor, selecione uma opção']" />

          <!-- Campos de Nome Participante -->
          <InputText filled v-model="participante.nome" label="Nome do participante" label-color="primary"
            class="custom-input-field p-inputtext-label-primary"
            :rules="[val => val !== '' || 'Nome não pode ser vazio']" />

          <!-- Campo de Email Participante -->
          <InputText filled v-model="participante.email" label="Email do participante" label-color="primary"
            class="input p-inputtext-label-primary" />
        </div>

        <div class="button-container">
          <Button label="Criar" type="submit" class="login-btn" />
          <Button label="Limpar" type="reset" class="register-btn" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Escalada } from 'src/models/Escalada';
import { Participante } from 'src/models/Participante';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import { Notify } from 'quasar';
import AuthenticateService from 'src/services/AuthenticateService';
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";

const observacao = ref('');
const qtdParticipantes = ref(1);
const route = useRoute();
const router = useRouter();
const data = ref('');
const participantes = ref<Participante[]>([{ nome: '', tipo: '', email: '' }]);
const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{ (e: 'closeModal'): void; }>();

const participanteTipoOptions = ['GUIA', 'PARTICIPANTE', 'MISTO'];

const onQtdParticipantesChange = () => {
  const currentLength = participantes.value.length;
  const newLength = Number(qtdParticipantes.value);

  if (newLength > currentLength) {
    for (let i = currentLength; i < newLength; i++) {
      participantes.value.push({ nome: '', tipo: '', email: '' });
    }
  } else {
    participantes.value.length = newLength;
  }
};
watch(qtdParticipantes, onQtdParticipantesChange);

const onSubmit = async () => {
  const viaId = Number(route.params.id);

  const escalada: Escalada = {
    via: viaId,
    data: convertStringToDate(data.value),
    observacao: observacao.value,
    participantes: participantes.value,
    usuario: Number(localStorage.getItem('usuarioId')) || 0
  };

  await AuthenticateService.redirecionaSeNaoAutenticado(router);
  try {
    await EscaladaService.createEscalada(escalada);
    onReset();
    Notify.create({
      type: 'positive',
      message: 'Escalada registrada com sucesso!',
      position: 'top-right',
      timeout: 3000
    });
    emit('closeModal');
  } catch (error: any) {
    const errorMessage = 'Ocorreu um erro no servidor, tente novamente mais tarde';
    Notify.create({
      type: 'negative',
      message: '' + errorMessage,
      position: 'top-right',
      timeout: 3000
    });
  }
};

const convertStringToDate = (date: string): Date => {
  const formattedDate = date.trim().split('-').reverse().join('-');
  return new Date(formattedDate);
};

const onReset = () => {
  observacao.value = '';
  data.value = '';
  qtdParticipantes.value = 1;
  participantes.value = [{ nome: '', tipo: '', email: '' }];
};
</script>

<style lang="scss">
@import "src/css/app.scss";

.modal-overlay {
  position: fixed;
  top: 1%;
  left: 20;
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.card-style {
  background-color: $background;
  color: $primary;
  width: 100%;
  max-height: 85vh;
  max-width: 600px;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;

  /* Estilização da barra de rolagem (scrollbar) para navegadores WebKit (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Estilização da barra de rolagem (scrollbar) para Firefox */
  scrollbar-width: auto;
  scrollbar-color: #888 #f1f1f1;
}

.header-section {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  color: $primary;
  justify-content: space-between;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: $primary;
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  width: 90%;
  color: $primary;
}

.participante-section {
  width: 90%;
  border-radius: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-top: 10px;
}

.participante-title {
  font-size: 18px;
  font-weight: bold;
  color: $primary;
  text-align: left;
  margin: 0 0 8px 10px;
}

.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  width: 40%;
  border-radius: 10px;
  font-weight: bold;
}

.flat {
  color: $primary;
}

.icon-primary {
  color: $primary;
}
</style>