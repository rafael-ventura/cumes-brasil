<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 700px">
      <q-img src="../../../assets/logo.png" alt="Cumes Brasil" class="q-mb-md" />
      <div class="text-h3 text-center q-mb-md">Bem-vindo ao Cumes Brasil</div>

      <div class="text-h5 text-center q-mb-md">Descubra Sua Próxima Aventura</div>
      <q-input filled v-model="search" label="Busque vias de escalada" class="q-mb-md" @keyup.enter="searchRoutes" />
      <div class="row q-gutter-md">
        <div v-for="highlight in highlights" :key="highlight.id" class="col-12 col-md-6">
          <q-card>
            <q-img :src="highlight.image" :alt="highlight.name" />
            <q-card-section>
              <div class="text-h6">{{ highlight.name }}</div>
              <div class="text-caption">{{ highlight.description }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Detalhes" @click="goToRoute()" />
              <q-btn flat label="Salvar" @click="saveRoute()" />
              <q-btn flat label="Escalada" @click="markAsClimbed()" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref("");
const highlights = ref([{
  id: 1,
  name: "Via Láctea",
  image: "path/to/image.jpg",
  description: "Ideal para iniciantes."
}]);

defineOptions({
  name: "HomePage"
});

function searchRoutes () {
  // Lógica para buscar vias
}

function goToRoute () {
  // Lógica para abrir a página de detalhes da via
}

function saveRoute () {
  // Lógica para salvar a via na coleção do usuário
}

function markAsClimbed () {
  // Lógica para marcar a via como escalada
}
</script>
