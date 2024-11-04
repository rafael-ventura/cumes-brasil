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

    <p class="via-detalhes">
      <template v-if="hasDetalhesValidos">
        <span v-for="(detalhe, index) in detalhesArray" :key="index">
          {{ detalhe }}
        </span>
      </template>
      <template v-else>
        Não foi possível encontrar o Grau desta via
      </template>
    </p>

    <!-- Exibe a extensão separadamente -->
    <p class="via-extensao" v-if="extensaoValida">
      {{ extensaoValida }}
    </p>

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
import { computed, defineProps } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps({
  via: {
    type: Object as () => Via,
    required: true
  }
});

const isValid = (value: any) => value != null && value !== 'N/A';

const detalhesArray = computed(() => {
  return [
    isValid(props.via?.grau) ? props.via?.grau : null,
    isValid(props.via?.crux) ? props.via?.crux : null,
    isValid(props.via?.artificial) ? props.via?.artificial : null,
    isValid(props.via?.exposicao) ? props.via?.exposicao : null,
    isValid(props.via?.duracao) ? props.via?.duracao : null
    // 'extensao' foi removida daqui
  ].filter(Boolean);
});

const hasDetalhesValidos = computed(() => detalhesArray.value.length > 0);

const extensaoValida = computed(() => {
  return isValid(props.via?.extensao) ? `${props.via.extensao} Metros` : null;
});
</script>

<style scoped lang="scss">
.card-info-principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 6%;
  background-color: var(--q-primary);
  border-radius: 10px;
  padding: 0;
}

.card-imagem {
  width: 100%;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
}

.via-nome {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.via-detalhes {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.via-extensao {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.via-localizacao {
  font-size: 14px;
  color: #666;
}
</style>
