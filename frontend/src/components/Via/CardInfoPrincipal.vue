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
  margin-bottom: 24px;
  background-color: $primary;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-imagem {
  width: 100%;
  height: 250px;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
  position: relative;
}

.btn-back {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.via-nome {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: bold;
  color: black;
  text-align: left;
  width: 100%;
  margin: 16px 0 8px 0;
  padding: 0 16px;
}

.via-localizacao {
  font-size: clamp(16px, 3vw, 20px);
  font-weight: 500;
  color: black;
  text-align: left;
  width: 100%;
  margin-bottom: 16px;
  padding: 0 16px;
}

.grau-container {
  margin: 16px 0 24px 0;
}

// Desktop
@media (min-width: 768px) {
  .card-imagem {
    height: 350px;
  }
  
  .via-nome {
    font-size: 42px;
    margin: 24px 0 12px 0;
    padding: 0 32px;
  }
  
  .via-localizacao {
    font-size: 22px;
    margin-bottom: 20px;
    padding: 0 32px;
  }
  
  .grau-container {
    margin: 20px 0 32px 0;
  }
}
</style>
