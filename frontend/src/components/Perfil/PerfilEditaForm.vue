<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">{{ props.title }}</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="nome" label="Nome" type="text" required />
        <q-input v-model="email" label="Email" type="email" required />
        <q-input v-model="senha" label="Senha" type="password" :placeholder="senhaPlaceholder" />

        <q-input v-model="fotoPerfil" label="URL da Foto de Perfil" type="text" />

        <q-btn type="submit" :label="submitLabel" color="primary" class="q-mt-md" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';
import { Usuario } from 'src/models/Usuario';

const props = defineProps<{ user: Usuario, title: string, submitLabel: string }>();
const emits = defineEmits(['submit']);

const nome = ref(props.user.nome);
const email = ref(props.user.email);
const senha = ref('');
const fotoPerfil = ref(props.user.foto_perfil?.url);

const senhaPlaceholder = props.user.password_hash ? 'Deixe em branco para manter a senha atual' : 'Senha';

const onSubmit = () => {
  emits('submit', {
    ...props.user,
    nome: nome.value,
    email: email.value,
    senha: senha.value || props.user.password_hash,
    fotoPerfil: fotoPerfil.value
  });
};
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: auto;
}
.q-mt-md {
  margin-top: 16px;
}
</style>
