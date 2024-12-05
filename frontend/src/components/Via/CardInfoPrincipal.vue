<template>
  <div class="card-info-principal">
    <q-img
      v-if="via && via.imagem && via.imagem.url"
      :src="via.imagem.url"
      :alt="via.nome"
      class="card-imagem"
    />

    <h2 class="via-nome" v-if="via?.nome && via.nome !== 'N/A'">
      {{ via.nome }}
    </h2>

    <!-- Usa o GrauBadge com a string formatada e extensão -->
    <GrauBadge
      :via="props.via"
      @showInfo="showGrauInfo = true"
      class="grau-container"
    />

    <!-- Localização destacada -->
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
import { defineProps, ref } from 'vue';
import { Via } from 'src/models/Via';
import GrauBadge from 'src/components/Via/GrauBadge.vue';

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
  padding: 0;
}

.via-nome {
  font-size: 36px;
  font-weight: bold;
  color: black;
  text-align: left;
  width: 100%;
  margin-bottom: 5px; /* Reduz o espaço */
  padding-left: 1%;
}

.via-extensao {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.via-localizacao {
  font-size: 20px; /* Aumenta o tamanho da fonte */
  font-weight: bold; /* Destaque */
  color: black;
  margin-top: 3%;
  text-align: left;
  margin-bottom: 3%;
  padding-left: 1%;
}

.grau-container {
  margin: 5px 0; /* Reduz o espaço entre o título e o grau */
}
</style>
