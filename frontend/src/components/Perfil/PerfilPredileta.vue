<template>
  <div class="q-pa-md q-mb-md no-wrap top-margem fundo1 border-radius-large">
    <div class="row title-box border-radius-medium">
      <div class="text-h5 titulo">Predileta</div>
      <q-icon name="edit" class="medium-icon right-margem icon"/>
    </div>
    <q-separator spaced />

    <!-- Exibição dos detalhes da via favorita -->
    <div v-if="props.user?.via_preferida">
      <ViaCardSmall :via="props.user.via_preferida" @click="handleViaClick" />
    </div>
    <q-card-section v-else>
      <div class="text-h6">Nenhuma predileta adicionada.</div>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
import { IUsuario } from 'src/models/IUsuario';
import ViaCardSmall from 'components/Via/ViaCardSmall.vue';

const props = defineProps<{ user?: IUsuario | null }>();

const handleViaClick = () => {
  console.log('Via predileta clicada:', props.user?.via_preferida?.nome);
};

</script>

<style scoped lang="scss">
@import "src/css/app.scss";
.title-box{
  padding-top: 10px;
  background-color: $dark;
  height: 50px;
  width: max-content;
}
.titulo {
  margin-left: 16px;
  color: $primary;
}
.icon{
  color: $dark;
  background-color: $primary;
  border-radius: 5px;
  margin-left: 20px;
}
.right-margem {
  margin-right: 16px;
}
.custom-input{
  background-color: $dark;
  border-radius: 10px;
  font-size: 20px;
  color: white;
}
.fundo1{
  background-color: $primary;
}

.imagem-via-predileta{
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 10px solid $dark;
  object-fit: cover;
}
</style>
