<template>
  <q-card style="min-width: 300px; max-width: 500px;">
    <q-card-section>
      <div class="text-h6">Filtros Avançados</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="onSubmit">
        <q-input v-model="filters.nome" label="Nome" type="text" />
        <q-select
          v-model="filters.grau"
          :options="grauOptions"
          label="Grau"
          clearable
        />
        <q-select
          v-model="filters.montanha"
          :options="montanhaOptions"
          label="Montanha"
          clearable
        />
        <q-select
          v-model="filters.bairro"
          :options="bairroOptions"
          label="Bairro"
          clearable
        />
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-input v-model="filters.extensaoMin" label="Extensão Mínima" type="number" />
          </div>
          <div class="col">
            <q-input v-model="filters.extensaoMax" label="Extensão Máxima" type="number" />
          </div>
        </div>
        <q-btn type="submit" label="Aplicar" color="primary" class="q-mt-md" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emits = defineEmits(['apply-filters'])

const filters = ref({
  nome: '',
  grau: '',
  montanha: '',
  bairro: '',
  extensaoMin: null,
  extensaoMax: null
})

const grauOptions = [
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' }
  // Adicione outras opções conforme necessário
]

const montanhaOptions = [
  { label: 'Montanha 1', value: 'Montanha 1' },
  { label: 'Montanha 2', value: 'Montanha 2' }
  // Adicione outras opções conforme necessário
]

const bairroOptions = [
  { label: 'Bairro 1', value: 'Bairro 1' },
  { label: 'Bairro 2', value: 'Bairro 2' }
  // Adicione outras opções conforme necessário
]

const onSubmit = () => {
  emits('apply-filters', filters.value)
}
</script>
