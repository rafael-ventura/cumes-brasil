<template>
  <div class="via-detalhada">
    <h1>Via De Escalada</h1>
    <div class="via-detalhada-info">
      <p>Nome: {{ nome }}</p>
      <p>Local: {{ local }}</p>
      <p>Descrição: {{ descricao }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nome: "Via 1",
      local: "Local 1",
      descricao: "Descrição da via 1"
    };
  }
};

</script>
