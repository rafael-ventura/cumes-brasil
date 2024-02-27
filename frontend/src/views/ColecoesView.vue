<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="448" class="mx-auto" color="grey-lighten-3">
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="n in 4"
            :key="n"
            cols="12"
          >
            <v-card
              :title="`Content ${n}`"
              :subtitle="`Subtitle for Content ${n}`"
              class="pa-4"
            >
              <v-card-title v-text="`Content ${n}`"></v-card-title>
              <v-card-subtitle v-text="`Subtitle for Content ${n}`"></v-card-subtitle>
              <v-card-text>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script setup>
import NavBar from "@/components/NavBar.vue";
</script>
