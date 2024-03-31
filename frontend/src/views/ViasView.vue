<template>
  <div class="cards">
      <button class="card card-content" v-for="(via, index) in vias" :key="index" @click="goViaDetalhadaView(via)">
        <div class="box left">
          <span class="nome-via ellipsis">{{ via.nome }}</span>
          <span class="nome-montanha ellipsis">{{ via.montanha_id.nome }}</span>
          <span class="extensao-via ellipsis">Extensão: {{ via.extensao }} m</span>
        </div>
        <div class="break"/>
        <div class="box right">
          <span class="grau-crux ellipsis">Grau: {{ via.grau }}</span>
          <span class="grau-crux ellipsis">Crux: {{ via.crux }}</span>
        </div>
      </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import viaService from "@/services/viaService";

const headers = [
  {
    title: "Nome",
    key: "nome"
  },
  {
    title: "Montanha",
    key: "montanha_id.nome"
  },
  {
    title: "Extensão (m)",
    key: "extensao"
  },
  {
    title: "Grau",
    key: "grau"
  },
  {
    title: "Crux",
    key: "crux"
  }
];
const vias = ref([]);
const router = useRouter();

const goViaDetalhadaView = async (via) => {
  try {
    await router.push(`/vias/${via.id}`);
  } catch (error) {
    console.error("Erro ao redirecionar para detalhes da via:", error);
  }
};

onMounted(async () => {
  try {
    const response = await viaService.getAllVias();
    vias.value = response;
  } catch (error) {
    console.error("Erro ao obter lista de vias:", error);
  }
});
</script>
<style lang="scss">
@import "@/assets/styles";

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); // Adiciona a função minmax
  justify-content: center; // Centraliza os cards
  gap: 10px; // Espaçamento entre os cards
  padding-top: 7px;

  .card {
    background-size: cover;
    background-position: center;
    border-radius: 15px;

    .card-content {
      background-color: map-get($colors, "primary");
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      text-align: left;
      color: map-get($colors, "text-light");
      padding-top: 10px;
      padding-bottom: 12px;
      height: 120px;
      &:hover {
        background-color: map-get($colors, "secondary");
      }
    }

    .break {
      flex-basis: 100%; // cria uma div para pular a linha
    }

    .box {
      display: flex;
      flex-direction: column;

      .ellipsis {
        white-space: nowrap; // Evita que o texto quebre em várias linhas
        overflow: hidden; // Oculta o texto excedente
        text-overflow: ellipsis; // Adiciona reticências ao texto excedente
      }

      .nome-via,
      .nome-montanha,
      .extensao-via {
        padding-right: 5px;
      }

      .nome-via {
        font-size: x-large;
        color: map-get($colors, "text-light");
        white-space: nowrap;
        max-width: 120px;
      }

      .nome-montanha {
        font-size: large;
      }

      .extensao-via {
        font-size: small;
      }
    }

    .box.left {
      align-self: flex-start;
    }

    .box.right {
      align-self: flex-end;
    }
  }
  @media (max-width: 600px) {
    .card {
      .card-content {
        width: 85vw; // Aumenta o tamanho dos cards em telas pequenas
      }
    }
  }
  @media (min-width: 540px) {
    .card {
      .card-content {
        width: 40vw; // Ajuste o tamanho dos cards para esse intervalo de tela
      }
    }
  }
  @media (min-width: 780px) {
    .card {
      .card-content {
        width: 420px; // Ajuste o tamanho dos cards para esse intervalo de tela
      }
    }
  }
}
</style>
