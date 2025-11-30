<template>
  <q-expansion-item
    expand-separator
    icon="location_on"
    label="Localização"
    :header-class="isExpanded ? 'expansion-header-expanded' : 'expansion-header'"
    content-class="expansion-content"
    @expand="isExpanded = true"
    @collapse="isExpanded = false"
  >
    <div class="localizacao-container" v-if="via?.localizacao">
      <!-- Informações Principais (sempre visíveis) -->
      <div class="localizacao-principal">
        <div class="info-item" v-if="via.localizacao.estado">
          <q-icon name="flag" size="20px" />
          <span class="label">Estado:</span>
          <span class="value">{{ via.localizacao.estado.nome }} ({{ via.localizacao.estado.sigla }})</span>
        </div>
        
        <div class="info-item" v-if="via.localizacao.cidade">
          <q-icon name="location_city" size="20px" />
          <span class="label">Cidade:</span>
          <span class="value">{{ via.localizacao.cidade.nome }}</span>
        </div>
        
        <div class="info-item" v-if="via.localizacao.bairro">
          <q-icon name="home" size="20px" />
          <span class="label">Bairro:</span>
          <span class="value">{{ via.localizacao.bairro.nome }}</span>
        </div>
      </div>

      <!-- Informações Adicionais (expandidas) -->
      <div class="localizacao-adicional">
        <div class="info-item" v-if="via.localizacao.regiao">
          <q-icon name="map" size="20px" />
          <span class="label">Região:</span>
          <span class="value">{{ via.localizacao.regiao.nome }}</span>
        </div>
        
        <div class="info-item" v-if="via.localizacao.pais">
          <q-icon name="public" size="20px" />
          <span class="label">País:</span>
          <span class="value">{{ via.localizacao.pais.nome }}</span>
        </div>
        
        <div class="info-item" v-if="via.localizacao.continente">
          <q-icon name="language" size="20px" />
          <span class="label">Continente:</span>
          <span class="value">{{ via.localizacao.continente.nome }}</span>
        </div>
      </div>

      <!-- Coordenadas Geográficas -->
      <div class="coordenadas" v-if="via.latitude && via.longitude">
        <q-icon name="gps_fixed" size="20px" />
        <span class="label">Coordenadas:</span>
        <span class="value">{{ via.latitude.toFixed(6) }}, {{ via.longitude.toFixed(6) }}</span>
      </div>
    </div>
    <div v-else class="sem-localizacao">
      <q-icon name="location_off" size="24px" />
      <span>Localização não disponível</span>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Via } from 'src/models/Via';

const props = defineProps<{
  via: Via;
}>();

const isExpanded = ref(false);
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.q-expansion-item {
  background-color: $primary;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
}

.expansion-content {
  background-color: $background;
}

.localizacao-container {
  padding: 16px;
  background-color: $background;
  border: 1px solid $cumes-01;
  border-radius: 8px;
  color: $cumes-03;
}

.localizacao-principal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid $cumes-01;
}

.localizacao-adicional {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;

  .q-icon {
    color: $cumes-01;
    flex-shrink: 0;
  }

  .label {
    font-weight: 600;
    color: $cumes-03;
    min-width: 80px;
  }

  .value {
    font-weight: 500;
    color: $cumes-01;
  }
}

.coordenadas {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 2px solid $cumes-01;
  font-size: 16px;

  .q-icon {
    color: $cumes-01;
    flex-shrink: 0;
  }

  .label {
    font-weight: 600;
    color: $cumes-03;
    min-width: 120px;
  }

  .value {
    font-weight: 500;
    color: $cumes-01;
    font-family: monospace;
  }
}

.sem-localizacao {
  padding: 24px;
  text-align: center;
  color: gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>

