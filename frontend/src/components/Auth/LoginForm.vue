<template>
  <q-card class="login-card">
    <q-card-section>
      <div class="text-h6">Login</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="email"
                 label="Email"
                 type="email"
                 required/>
        <q-input v-model="senha"
                 label="Senha"
                 type="password"
                 required/>
        <q-btn type="submit"
               :label="submitLabel"
               class="q-mt-md btn"
        />
        <slot></slot>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

defineProps({
  submitLabel: String
});

const emits = defineEmits(['submit']);

const email = ref('');
const senha = ref('');

const onSubmit = () => {
  emits('submit', {
    email: email.value,
    senha: senha.value
  });
};
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: auto;
}
</style>
