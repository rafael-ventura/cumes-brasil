<template>
  <v-container>
    <h1>Explorar Vias</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="via in vias" :key="via.id">
        <v-card>
          <v-card-title>{{ via.nome }}</v-card-title>
          <v-card-text>
            <div>{{ via.local }}</div>
            <div>{{ via.descricao }}</div>
            <v-btn :to="{ name: 'ViaDetalhada', params: { id: via.id } }" text>Detalhes</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      vias: [
        {
          id: 1,
          nome: "Via 1",
          local: "Local 1",
          descricao: "Descrição da via 1"
        },
        {
          id: 2,
          nome: "Via 2",
          local: "Local 2",
          descricao: "Descrição da via 2"
        },
        {
          id: 3,
          nome: "Via 3",
          local: "Local 3",
          descricao: "Descrição da via 3"
        }
      ]
    };
  }
};

</script>
