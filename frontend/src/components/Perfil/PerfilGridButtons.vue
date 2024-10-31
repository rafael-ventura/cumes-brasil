<template>
  <q-item-section>
    <div class="row q-col-gutter-sm justify-around margin-top">
      <div v-for="(item, index) in items" :key="index" class="col-xs-4 col-sm-2 col-md-2 col-lg-2 col-xl-2">
        <q-item flat :label="item.label" clickable :to="item.to" class="shadow-item box-item tamanho" :style="{ backgroundColor: item.color }">
          <q-item-section class="q-column items-center text-center">
            <div class="row items-center justify-center">
              <div class="large-text">{{ item.num }}</div>
              <q-icon :name="item.icon" class="medium-icon left-margem" />
            </div>
            <div class="texto text-h7">{{ item.label }}</div>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-item-section>
</template>

<script setup lang="ts">

// Recebe as props do componente pai
defineProps<{
  items: Array<{ label: string; num: number; icon: string; color: string; to: string }>;
}>();
</script>

<style scoped>
.large-text {
  font-size: 18px; /* Ajuste o tamanho conforme necessário */
  font-weight: bold; /* Opcional: para deixar o texto mais destacado */
}

.box-item {
  display: flex; /* Torna o item um contêiner flexível */
  align-items: center; /* Alinha o conteúdo verticalmente no centro */
  justify-content: center; /* Alinha o conteúdo horizontalmente no centro */
  height: 100%; /* Faz com que o item ocupe toda a altura disponível da coluna */
}

.margin-top{
  margin: 15px 0px; /* Adiciona um espaçamento acima do componente */
}

.texto{
  font-size: 18px;
}

.tamanho{
  padding: 5px; /* Remove o espaçamento interno do item */
  min-width: 80px;
  max-width: 140px;
}
</style>
