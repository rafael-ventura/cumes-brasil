<template>
  <v-container>
    <v-card class="mx-auto">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="card in cards"
            :key="card.title"
            cols="12" sm="6" md="4"
          >
            <v-card>
              <v-img
                :src="card.src"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
                cover
              >
                <v-card-title class="text-white" v-text="card.title"></v-card-title>
              </v-img>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"></v-btn>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-bookmark"></v-btn>
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant"></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>

</template>

<script lang="ts">

export default {
  data: () => ({
    cards: [
      {
        src: "https://cdn.vuetifyjs.com/images/cards/desert.jpg",
        title: "Desert"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
        title: "Sunshine"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/cards/sand.jpg",
        title: "Sand"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/cards/plant.jpg",
        title: "Plant"
      }
    ]
  })
};
</script>
