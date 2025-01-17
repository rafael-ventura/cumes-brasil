<template>
  <q-page class="examples-page">
    <div class="example-section">
      <h2>Buttons</h2>
      <q-btn label="Primary Button" color="primary" class="q-mb-md" />
      <q-btn label="Secondary Button" color="secondary" class="q-mb-md" />
      <!--É possível chamar um botão padrão do Cume apenas chamando a classe btn em um q-btn -->
      <q-btn label="Primary Button" class="q-mb-md btn" />
      <q-btn label="Secondary Button" color="secondary" class="q-mb-md btn-text-black" />
      <!--Botões customizados -->
      <q-btn label="Custom Button" class="custom-button-pink q-mb-md btn-text-black" />
      <q-btn label="Custom Button" class="custom-button-blue q-mb-md" />
      <q-btn label="Custom Button" class="custom-button-purple q-mb-md" />
      <q-btn label="Custom Button" class="custom-button-green q-mb-md" />
    </div>

    <div class="example-section">
      <h2>Forms</h2>
      <q-input filled v-model="formData.input" label="Input Field" class="q-mb-md" />
      <q-select filled v-model="formData.select" :options="selectOptions" label="Select Field" class="q-mb-md" />
      <q-btn label="Submit" class="btn" @click="submitForm" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
  input: '',
  select: null
});

const selectOptions = ref([
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 }
]);

const submitForm = () => {
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.examples-page {
  padding: 16px;
}

.example-section {
  margin-bottom: 32px;
}

.custom-button-blue {
  background-color: $c-color-blue;
  color: white;
}

.custom-button-pink {
  background-color: $c-color-pink;
  color: white;
}

.custom-button-purple{
  background-color: $c-color-purple;
  color: white;
}

.custom-button-green{
  background-color: $c-color-green;
  color: white;
}
</style>
