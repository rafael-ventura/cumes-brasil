<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Redefinir Senha</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="onResetPassword">
          <q-input v-model="email"
                   label="Email"
                   type="email"
                   required/>

          <slot></slot>

          <q-btn type="submit"
                 label="Redefinir Senha"
                 color="primary"
                 class="q-mt-md"/>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticateService from '../../services/AuthenticateService';
import { ref } from 'vue';

const email = ref('');

defineOptions({
  name: 'ResetPasswordPage'
});

const onResetPassword = async () => {
  try {
    const response = await AuthenticateService.resetPassword(email.value);
    console.log(response.data);
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error.message);
  }
};
</script>
