<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">{{ props.title }}</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="nome" label="Nome" type="text" required/>
        <q-input v-model="email" label="Email" type="email" required/>
        <q-input v-model="senha" label="Senha" type="password" required/>

        <slot></slot>

        <q-btn type="submit" :label="submitLabel" color="primary" class="q-mt-md"/>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
  title: String,
  submitLabel: String
})

const emits = defineEmits(['submit'])

const nome = ref('')
const email = ref('')
const senha = ref('')

const onSubmit = () => {
  emits('submit', {
    nome: nome.value,
    email: email.value,
    senha: senha.value
  })
}
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>
