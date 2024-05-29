<template>
  <div class="sort-options">
    <q-list class="q-pa-none">
      <q-item class="q-pa-none">
        <q-item-section>
          <div class="q-gutter-sm">
            <q-icon color="negative" name="filter_hdr" @click="ordenaVias('grau', ordemGrau)"/>
            <q-icon
              color="negative"
              :name="ordemGrau === 'desc' ? 'arrow_downward' : 'arrow_upward'"
              @click="toggleOrdem('grau')"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <div class="q-gutter-sm">
            <q-icon color="negative" name="timer" @click="ordenaVias('extensao', ordemExtensao)"/>
            <q-icon
              color="negative"
              :name="ordemExtensao === 'desc' ? 'arrow_downward' : 'arrow_upward'"
              @click="toggleOrdem('extensao')"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none">
        <q-item-section>
          <div class="q-gutter-sm">
            <q-icon color="negative" name="date_range" @click="ordenaVias('data', ordemData)"/>
            <q-icon
              color="negative"
              :name="ordemData === 'desc' ? 'arrow_downward' : 'arrow_upward'"
              @click="toggleOrdem('data')"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn flat icon="close" @click="fechaMenuOrdenacao" class="close-btn"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Via } from "src/models/Via";

const ordenaMenu = ref(false);

const ordemGrau = ref<"asc" | "desc">("desc");
const ordemExtensao = ref<"asc" | "desc">("desc");
const ordemData = ref<"asc" | "desc">("desc");

const ordenaVias = (key: keyof Via, order: "asc" | "desc") => {
  emit("sort", { key, order });
};

const toggleOrdem = (key: keyof Via) => {
  if (key === "grau") {
    ordemGrau.value = ordemGrau.value === "desc" ? "asc" : "desc";
  } else if (key === "extensao") {
    ordemExtensao.value = ordemExtensao.value === "desc" ? "asc" : "desc";
  } else if (key === "data") {
    ordemData.value = ordemData.value === "desc" ? "asc" : "desc";
  }
};

const fechaMenuOrdenacao = () => {
  ordenaMenu.value = !ordenaMenu.value;
  emit("close");
};

const emit = defineEmits<{(e: "sort", params: { key: keyof Via; order: "asc" | "desc" }): void, (e: "close"): void }>();
</script>

<style scoped>
.sort-options {
  margin: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.close-btn {
  display: block;
  margin: 0 auto;
}

.q-gutter-sm {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
