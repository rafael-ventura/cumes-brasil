//não está sendo usando em nenhum lugar

<template>
  <div class="cards">
    <button class="card card-content">
      <div class="box left">
        <span class="nome-via ellipsis">{{ nome }}</span>
        <span class="nome-montanha ellipsis">{{ montanha }}</span>
        <span class="extensao-via">Extensão: {{ extensao }} m</span>
      </div>
      <div class="break"/>
      <div class="box right">
        <span class="grau-crux">Grau: {{ grau }}</span>
        <span class="grau-crux">Crux: {{ crux }}</span>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  props: ["nome", "montanha", "extensao", "grau", "crux"]
};
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
        max-width: 120px;
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
  }
}
</style>
