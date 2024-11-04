<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Redefinir Senha</div>
      </q-card-section>
      <q-card-section v-if="token" >
        <q-form @submit.prevent="onResetPassword">
          <q-input v-model="password"
                   label="Senha"
                   type="password"
                   required/>

          <q-input v-model="passwordRepeated"
                  label="Confirmar Senha"
                  type="password"
                  required/>
          <slot></slot>

          <q-btn type="submit"
                 label="Redefinir Senha"
                 color="primary"
                 class="q-mt-md"/>
        </q-form>
      </q-card-section>

      <q-card-section v-if="token.length === 0" >
        <q-form @submit.prevent="onGeneratePasswordToken">
          <q-input v-model="email"
                   label="Email"
                   type="email"
                   required/>

          <slot></slot>

          <q-btn type="submit"
                 label="Esqueci minha senha"
                 color="primary"
                 class="q-mt-md"/>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticateService from '../../services/AuthenticateService';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify } from 'src/utils/utils';
import { Notify } from 'quasar';

const email = ref('');
const password = ref('');
const passwordRepeated = ref('');
const token = ref('');
const route = useRoute();
const router = useRouter();

defineOptions({
  name: 'ResetPasswordPage'
});

const onGeneratePasswordToken = async () => {
  try {
    const response = await AuthenticateService.generateUserResetPassword(email.value);
    Notify.create(showNotify('positive', response.data.message, 'top-center'));
  } catch (error: any) {
    Notify.create(showNotify('negative', error.message, 'top-center'));
  }
};

onMounted(async () => {
    token.value = route.params.userToken?.toString() || ''; 
  }
);

const onResetPassword = async () => {
  try {
    const response = await AuthenticateService.resetPassword(password.value, passwordRepeated.value, token.value);
    Notify.create(showNotify('positive', response.data.message, 'top-center'));
    router.push('/auth/login');
  } catch (error: any){
    console.error('Erro ao redefinir senha:', error.message);
    Notify.create(showNotify('negative', error.message, 'top-center'));
  }
}

</script>
