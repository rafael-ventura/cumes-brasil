<template>
  <q-card class="login-card">
    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="custom-cadastro-form">
        <div class="custom-input">
          <div class="input-container">
            <q-icon name="person" class="input-icon" />
            <label for="nome" class="input-label">Nome</label>
          </div>
          <q-input
            id="nome"
            v-model="nome"
            type="text"
            outlined
            dense
            color="primary"
            bg-color="dark"
            label-color="primary"
            hide-bottom-space
            :rules="[val => !!val || 'Campo obrigatório']"
            class="custom-input-field"
          />
        </div>

        <div class="custom-input">
          <div class="input-container">
            <q-icon name="mail" class="input-icon" />
            <label for="email" class="input-label">Email</label>
          </div>
          <q-input
            id="email"
            v-model="email"
            type="email"
            outlined
            dense
            color="primary"
            bg-color="dark"
            label-color="primary"
            hide-bottom-space
            :rules="[val => !!val || 'Campo obrigatório']"
            class="custom-input-field"
          />
        </div>

        <div class="custom-input">
          <div class="input-container">
            <q-icon name="lock" class="input-icon" />
            <label for="senha" class="input-label">Senha</label>
          </div>
          <q-input
            id="senha"
            v-model="senha"
            type="password"
            outlined
            dense
            color="primary"
            bg-color="dark"
            label-color="primary"
            hide-bottom-space
            :rules="[val => !!val || 'Campo obrigatório']"
            class="custom-input-field"
          />
        </div>

        <slot></slot>

        <q-btn :label="submitLabel" class="register-btn" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps({
  title: String,
  submitLabel: String
});

const emits = defineEmits(['submit']);

const nome = ref('');
const email = ref('');
const senha = ref('');

const onSubmit = () => {
  emits('submit', {
    nome: nome.value,
    email: email.value,
    senha: senha.value
  });
};
</script>


<style scoped lang="scss">
@import 'src/css/app.scss';

.login-card {
  width: 100%;
  background-color: rgba($dark, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.titulo-cadastro {
  font-size: 1.5rem;
  text-align: center;
  color: $primary;
  margin-bottom: 20px;
}

.custom-input {
  width: 100%;
  margin-bottom: 16px;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-label {
  font-size: 1em;
  color: $primary;
  margin-left: 0.5em;
}

.input-icon {
  color: $primary;
  font-size: 1.2em;
}

.custom-input-field {
  width: 100%;
  background-color: rgba($dark, 0.85);
  border-radius: 5px;

  .q-field__control {
    border-color: $primary;
    color: $primary;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.register-btn, {
  width: 28%;
  height: 4vh;
  font-size: 0.85em;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 15px;
  max-width: 160px;
  max-height: 60px;
}
</style>
