<template>
  <div class="cards">
    <button class="card" v-for="(via, index) in vias" :key="index" @click="goViaDetalhadaView(via)">
      <div class="card-background"/>
      <div class="card-content">
        <div class="spacer">
          <span class="extensao-via">Extensão: {{ via.extensao }} m</span>
        </div>
        <div class="conteudo-blur">
          <div class="box left">
            <span class="nome-via ellipsis">{{ via.nome }}</span>
            <span class="nome-montanha ellipsis">{{ via.montanha_id.nome }}</span>
          </div>
          <div class="box right">
            <span class="grau-crux ellipsis">Grau: {{ via.grau }}</span>
            <span class="grau-crux ellipsis">Crux: {{ via.crux }}</span>
          </div>
        </div>
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); // Adiciona a função minmax
  justify-content: center; // Centraliza os cards
  gap: 10px; // Espaçamento entre os cards
  padding-top: 7px;

  .card {
    position: relative;
    border-radius: 15px;
    height: 150px;
    padding: 0px 0px;

    .card-background {
      position: absolute;
      width: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: url('@/assets/image.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 15px;
      transition: filter 0.3s ease;
    }

    &:hover .card-background {
      filter: blur(2px);
    }

    .card-content {
      position: relative;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      text-align: left;
      color: map-get($colors, "text-light");
    }

    .spacer {
      min-height: 80px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;

      .extensao-via {
        font-size: large;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 5px;
        margin: 5px;
      }
    }

    .conteudo-blur {
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 5px 10px;
      min-height: 70px;
    }

    .box {
      display: flex;
      flex-direction: column;

      .ellipsis {
        white-space: nowrap; // Evita que o texto quebre em várias linhas
        overflow: hidden; // Oculta o texto excedente
        text-overflow: ellipsis; // Adiciona reticências ao texto excedente
      }

      .nome-via {
        font-size: xx-large;
        color: map-get($colors, "text-light");
        white-space: nowrap;
        max-width: 260px;
      }

      .nome-montanha {
        font-size: large;
        max-width: 260px;
      }

      .grau-crux {
        font-size: large;
        max-width: 200px;
      }
    }

    .box.left {
      align-self: flex-start;
      align-items: flex-start;
    }

    .box.right {
      align-self: flex-start;
      align-items: flex-start;
      justify-content: space-around;
      padding-top: 5px;
    }
  }

  @media (max-width: 600px) {
    .card {
      .card-content {
        width: 85vw; // Aumenta o tamanho dos cards em telas pequenas
      }
    }
  }
}
</style>
