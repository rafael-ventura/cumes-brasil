<template>
  <q-dialog :model-value="props.isOpen">
    <q-card class="card-style">
      <q-card-section class="header-section">
        <div class="title">Criar Escalada</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="form-container">
        <q-input
          label-color="primary"
          color="primary"
          outlined
          label="Data da Escalada"
          v-model="data"
          class="input"
          mask="##-##-####"
          lazy-rules
          :rules="[ val => !!val || 'Campo obrigatório' ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer icon-primary">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date event-color="primary" text-color="black" color="primary" v-model="data" mask="DD-MM-YYYY" bordered />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          label-color="primary"
          filled
          v-model="observacao"
          label="Alguma observação?"
          type="textarea"
          class="input"
        />

        <div class="spacer"></div> <!-- Espaço extra entre observação e quantidade de participantes -->

        <q-input
          filled
          type="number"
          v-model.number="qtdParticipantes"
          label="Quantos participantes na escalada?"
          label-color="primary"
          color="primary"
          min="1"
          :rules="[ val => val > 0 || 'Participante não pode ser menor que zero' ]"
          class="input"
          @input="onQtdParticipantesChange"
        />

        <div v-for="(participante, index) in participantes" :key="index" class="participante-section">
          <h5 class="participante-title">Participante {{ index + 1 }}</h5>
          <q-select
            filled
            v-model="participante.tipo"
            label="Tipo do participante"
            label-color="primary"
            color="primary"
            :options="participanteTipoOptions"
            class="input"
            :rules="[ val => !!val || 'Por favor, selecione uma opção' ]"
          />
          <q-input
            filled
            v-model="participante.nome"
            label="Nome do participante"
            label-color="primary"
            class="input"
            :rules="[ val => val !== '' || 'Nome não pode ser vazio' ]"
          />
          <q-input
            filled
            v-model="participante.email"
            label="Email do participante"
            label-color="primary"
            class="input"
          />
        </div>

        <div class="button-container">
          <q-btn label="Criar" type="submit" color="primary" class="btn" />
          <q-btn label="Limpar" type="reset" color="primary" flat class="btn flat" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Escalada } from 'src/models/Escalada';
import { Participante } from 'src/models/Participante';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import { Notify } from 'quasar';
import AuthenticateService from 'src/services/AuthenticateService';

const observacao = ref('');
const qtdParticipantes = ref(1);
const route = useRoute();
const router = useRouter();
const data = ref('');
const participantes = ref<Participante[]>([{ nome: '', tipo: '', email: '' }]);
const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{(e: 'closeModal'): void; }>();

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
    viaId,
    data: convertStringToDate(data.value),
    observacao: observacao.value,
    participantes: participantes.value
  };

  if (!AuthenticateService.isAuthenticated()) {
    await router.push('/auth/login');
  } else {
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

<style scoped lang="scss">
@import "src/css/app.scss";

.card-style {
  background-color: $dark;
  color: $primary;
  width: 100%;
  max-height: 85vh;
  max-width: 600px;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header-section {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  color: $primary;
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

  .q-field__label,
  .q-field__native,
  .q-item__label,
  .q-select__dropdown-icon,
  .q-date__calendar-day {
    color: $primary;
  }
}

.spacer {
  height: 20px; /* Espaçamento entre observação e quantidade de participantes */
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
