<template>
  <div class="q-pa-md q-mb-md no-wrap top-margem fundo1 border-radius-large">
    <div class="row title-box border-radius-medium">
      <div class="text-h5 titulo">Predileta</div>
      <q-icon name="edit" class="medium-icon right-margem icon" @click="toggleEditMode" />
    </div>
    <q-separator spaced />

    <!-- Exibição dos detalhes da via favorita -->
    <q-card-section v-if="props.user?.via_preferida" class="card-info">
      <div class="via-nome">{{ props.user.via_preferida.nome }}</div>

      <div class="montanha-face">
        <q-icon name="terrain" size="20px" />
        {{ props.user.via_preferida.montanha.nome }}
        <span v-if="props.user.via_preferida.face?.nome">, {{ props.user.via_preferida.face.nome }}</span>
      </div>

      <div class="grau-badge-container">
        <GrauBadge
          :grauText="props.user.via_preferida.grau || 'N/A'"
          :extensaoText="(props.user.via_preferida.extensao || 'N/A') + 'm'"
        />
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div class="text-h6">Nenhuma predileta adicionada.</div>
    </q-card-section>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { IUsuario } from 'src/models/IUsuario';
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import {Via} from "src/models/Via";

const props = defineProps<{ via: Via }>();

const isEditing = ref(false);

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
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
</style>
