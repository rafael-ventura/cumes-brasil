<template>
  <q-dialog :model-value="props.isOpen" >
    <q-card class="scroll card-style">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6" style="margin-bottom: 5vh;">Criar Escalada</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md form-all-container"
      >

        <q-input
          outlined
          label="Data da Escalada"
          v-model="data"
          class="input"
          hint="dd-mm-yyyy"
          mask="##-##-####"
          lazy-rules
          :rules="[ val => !!val || 'Campo obrigatório' ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="data" mask="DD-MM-YYYY" bordered landscape/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          filled
          v-model="observacao"
          label="Alguma observação?"
          type="textarea"
          hint="Observação"
          class="input"
          lazy-rules
        />

        <q-input
          filled
          type="number"
          v-model.number="qtdParticipantes"
          label="Quantos participantes na escalada?"
          hint="participantes"
          lazy-rules
          min="1"
          :rules="[
            val => val > 0 || 'Participante não pode ser menor que zero'
          ]"
          class="input"
          @input="onQtdParticipantesChange"
        />

        <div v-for="(participante, index) in participantes" :key="index" class="form-all-container">
          <h5 style="margin-left: 3vh"> Participante {{ index + 1 }}</h5>
          <q-select
            filled
            v-model="participante.tipo"
            :label="`Tipo do participante`"
            :options="participanteTipoOptions"
            class="input"
            behavior="menu"
            :rules="[val => !!val || 'Por favor, selecione uma opção']"
          />
          <q-input
            filled
            v-model="participante.nome"
            :label="`Nome do participante`"
            lazy-rules
            :rules="[val => val !== '' || 'Nome não pode ser vazio']"
            class="input"
          />
          <q-input
            filled
            v-model="participante.email"
            :label="`Email do participante`"
            class="input"
          />
        </div>

        <div class="form-btn-container">
          <q-btn label="Criar" type="submit" color="primary" class="btn"/>
          <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm btn"/>
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

const emit = defineEmits<{(e: 'closeModal'): void;}>();

const participanteTipoOptions = [
  'GUIA', 'PARTICIPANTE', 'MISTO'
];

const onQtdParticipantesChange = (): void => {
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

const onSubmit = async (): Promise<void> => {
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
        timeout: 3000,
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

const onReset = (): void => {
  observacao.value = '';
  data.value = '';
  qtdParticipantes.value = 1;
  participantes.value = [{ nome: '', tipo: '', email: '' }];
};

</script>

<style scoped>
.card-style {
  width: 80%;
  max-height: 80vh;
  max-width: 80vw;
}

.form-all-container{
  display: flex;
  width: 90%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  width: 80%;
  margin: 2vh auto;
}

.form-btn-container{
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.btn {
  width: 40%;
  margin-bottom: 2vh;
}

</style>
