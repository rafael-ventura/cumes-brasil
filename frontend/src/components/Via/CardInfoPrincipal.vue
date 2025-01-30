<template>
  <div class="card-info-principal">
    <!-- Imagem com Botão Sobreposto -->
    <q-img
      v-if="via && via.imagem && via.imagem.url"
      :src="via.imagem.url"
      :alt="via.nome"
      class="card-imagem"
    >
      <BotaoVoltar class="btn-back" />
    </q-img>

    <h2 class="via-nome" v-if="via?.nome && via.nome !== 'N/A'">
      {{ via.nome }}
    </h2>

    <!-- GrauBadge -->
    <GrauBadge
      :via="<Via>props.via"
      @showInfo="showGrauInfo = true"
      class="grau-container"
    />

    <!-- Localização -->
    <p class="via-localizacao">
      <span v-if="via?.montanha?.nome && via.montanha.nome !== 'N/A'">
        {{ via.montanha.nome }}
      </span>
      <span v-if="via?.face?.nome && via.face.nome !== 'N/A'">
        , Face {{ via.face.nome }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Via } from 'src/models/Via';
import GrauBadge from 'src/components/Via/GrauBadge.vue';
import router from 'src/router';
import BotaoVoltar from 'components/BotaoVoltar.vue';

const props = defineProps({
  via: {
    type: Object as () => Via,
    required: true
  }
});

const showGrauInfo = ref(false);

</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.card-info-principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 6%;
  background-color: $primary;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-imagem {
  width: 100%;
  height: 180px;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
  margin-bottom: -8%;
  position: relative;
}

.btn-back {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2; /* Garante que está acima da imagem */
}

.via-nome {
  font-size: 36px;
  font-weight: bold;
  color: black;
  text-align: left;
  width: 100%;
  margin-bottom: 5px;
  padding-left: 1%;
}

.via-localizacao {
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin-top: 3%;
  text-align: left;
  margin-bottom: 3%;
  padding-left: 1%;
}

.grau-container {
  margin: 5px 0;
}
</style>
