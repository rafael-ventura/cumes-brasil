<template>
  <div class="botoes-acao">
    <q-btn @click="checkAuthentication('registerEscalada')" class="btn-acao registrar">
      <q-icon name="add_circle" />
      <span>Registrar uma escalada</span>
    </q-btn>
    <q-btn @click="checkAuthentication('addFavorites')" class="btn-acao favoritos">
      <q-icon name="star_border" />
      <span>Adicionar a Favoritas</span>
    </q-btn>
    <q-btn @click="checkAuthentication('addToCollection')" class="btn-acao colecao">
      <q-icon name="style" />
      <span>Adicionar a uma Coleção</span>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';

const props = defineProps({
  onRegister: Function,
  onAddFavorite: Function,
  onAddCollection: Function
});

const router = useRouter();

const checkAuthentication = (action: string) => {
  if (!AuthenticateService.isAuthenticated()) {
    router.push('/auth/login');
  } else {
    switch (action) {
      case 'registerEscalada':
        props.onRegister && props.onRegister();
        break;
      case 'addFavorites':
        props.onAddFavorite && props.onAddFavorite();
        break;
      case 'addToCollection':
        props.onAddCollection && props.onAddCollection();
        break;
    }
  }
};
</script>
