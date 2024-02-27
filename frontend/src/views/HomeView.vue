<template>
  <v-container>
    <v-card
      class="mx-auto"
    >
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#385F73"
              theme="dark"
            >
              <v-card-title class="text-h5">
                Unlimited music now
              </v-card-title>

              <v-card-subtitle>Listen to your favorite artists and albums whenever and wherever, online and offline.</v-card-subtitle>

              <v-card-actions>
                <v-btn variant="text">
                  Listen Now
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              color="#1F7087"
              theme="dark"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h5">
                    Supermodel
                  </v-card-title>

                  <v-card-subtitle>Foster the People</v-card-subtitle>

                  <v-card-actions>
                    <v-btn
                      class="ms-2"
                      variant="outlined"
                      size="small"
                    >
                      START RADIO
                    </v-btn>
                  </v-card-actions>
                </div>

                <v-avatar
                  class="ma-3"
                  size="125"
                  rounded="0"
                >
                  <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              color="#952175"
              theme="dark"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h5">
                    Halcyon Days
                  </v-card-title>

                  <v-card-subtitle>Ellie Goulding</v-card-subtitle>

                  <v-card-actions>
                    <v-btn
                      class="ms-2"
                      icon="mdi-play"
                      variant="text"
                    ></v-btn>
                  </v-card-actions>
                </div>

                <v-avatar
                  class="ma-3"
                  size="125"
                  rounded="0"
                >
                  <v-img src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#1F7087"
              theme="dark"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="text-h5">
                    Supermodel
                  </v-card-title>

                  <v-card-subtitle>Foster the People</v-card-subtitle>

                  <v-card-actions>
                    <v-btn
                      class="ms-2"
                      variant="outlined"
                      size="small"
                    >
                      START RADIO
                    </v-btn>
                  </v-card-actions>
                </div>

                <v-avatar
                  class="ma-3"
                  size="125"
                  rounded="0"
                >
                  <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"></v-img>
                </v-avatar>
              </div>
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
