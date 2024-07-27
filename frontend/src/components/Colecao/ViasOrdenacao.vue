<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="modal-card q-pa-md">
      <q-card-section class="q-pa-none">
        <div class="sort-options">
          <q-list class="q-pa-none">
            <q-item class="q-pa-none">
              <q-item-section>
                <div class="q-gutter-sm q-row items-center justify-between">
                  <span class="sort-label">Grau</span>
                  <q-icon
                    class="sort-icon"
                    name="filter_hdr"
                    @click="toggleAtivo('grau')"
                    :class="{ active: grauAtivo }"
                  />
                  <q-icon
                    class="sort-icon"
                    color="negative"
                    :name="grauAtivo ? (ordemGrau === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'swap_vert'"
                    v-if="grauAtivo"
                    @click="toggleOrdem('grau')"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item class="q-pa-none">
              <q-item-section>
                <div class="q-gutter-sm q-row items-center justify-between">
                  <span class="sort-label">Duração</span>
                  <q-icon
                    class="sort-icon"
                    name="schedule"
                    @click="toggleAtivo('duracao')"
                    :class="{ active: duracaoAtivo }"
                  />
                  <q-icon
                    class="sort-icon"
                    color="negative"
                    :name="duracaoAtivo ? (ordemDuracao === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'swap_vert'"
                    v-if="duracaoAtivo"
                    @click="toggleOrdem('duracao')"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item class="q-pa-none">
              <q-item-section>
                <div class="q-gutter-sm q-row items-center justify-between">
                  <span class="sort-label">Extensão</span>
                  <q-icon
                    class="sort-icon"
                    name="straighten"
                    @click="toggleAtivo('extensao')"
                    :class="{ active: extensaoAtivo }"
                  />
                  <q-icon
                    class="sort-icon"
                    color="negative"
                    :name="extensaoAtivo ? (ordemExtensao === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'swap_vert'"
                    v-if="extensaoAtivo"
                    @click="toggleOrdem('extensao')"
                  />
                </div>
              </q-item-section>
            </q-item>
            <q-item class="q-pa-none">
              <q-item-section>
                <div class="q-gutter-sm q-row items-center justify-between">
                  <span class="sort-label">Data</span>
                  <q-icon
                    class="sort-icon"
                    name="event"
                    @click="toggleAtivo('data')"
                    :class="{ active: dataAtivo }"
                  />
                  <q-icon
                    class="sort-icon"
                    color="negative"
                    :name="dataAtivo ? (ordemData === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'swap_vert'"
                    v-if="dataAtivo"
                    @click="toggleOrdem('data')"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="buttons q-mt-md q-row items-center justify-between">
            <q-btn flat icon="refresh" label="Redefinir" @click="resetaOrdenacoes" class="q-mr-md"/>
            <q-btn flat icon="close" @click="fechaMenuOrdenacao"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { Via } from 'src/models/Via';

const isOpen = ref(true); // Controla se o modal está aberto ou não
const grauAtivo = ref(false);
const duracaoAtivo = ref(false);
const extensaoAtivo = ref(false);
const dataAtivo = ref(false); // Ordenação padrão inativa

const ordemGrau = ref<'asc' | 'desc'>('desc');
const ordemDuracao = ref<'asc' | 'desc'>('desc');
const ordemExtensao = ref<'asc' | 'desc'>('desc');
const ordemData = ref<'asc' | 'desc'>('asc');

const toggleAtivo = (key: string) => {
  if (key === 'grau') {
    grauAtivo.value = !grauAtivo.value;
    duracaoAtivo.value = false;
    extensaoAtivo.value = false;
    dataAtivo.value = false;
  } else if (key === 'duracao') {
    duracaoAtivo.value = !duracaoAtivo.value;
    grauAtivo.value = false;
    extensaoAtivo.value = false;
    dataAtivo.value = false;
  } else if (key === 'extensao') {
    extensaoAtivo.value = !extensaoAtivo.value;
    grauAtivo.value = false;
    duracaoAtivo.value = false;
    dataAtivo.value = false;
  } else if (key === 'data') {
    dataAtivo.value = !dataAtivo.value;
    grauAtivo.value = false;
    duracaoAtivo.value = false;
    extensaoAtivo.value = false;
  }
  if (!grauAtivo.value && !duracaoAtivo.value && !extensaoAtivo.value && !dataAtivo.value) {
    emit('reset');
  } else {
    aplicaOrdenacoes();
  }
};

const toggleOrdem = (key: keyof Via) => {
  if (key === 'grau' && grauAtivo.value) {
    ordemGrau.value = ordemGrau.value === 'desc' ? 'asc' : 'desc';
  } else if (key === 'duracao' && duracaoAtivo.value) {
    ordemDuracao.value = ordemDuracao.value === 'desc' ? 'asc' : 'desc';
  } else if (key === 'extensao' && extensaoAtivo.value) {
    ordemExtensao.value = ordemExtensao.value === 'desc' ? 'asc' : 'desc';
  } else if (key === 'data' && dataAtivo.value) {
    ordemData.value = ordemData.value === 'desc' ? 'asc' : 'desc';
  }
  aplicaOrdenacoes();
};

const aplicaOrdenacoes = () => {
  let orderParams: { key: keyof Via; order: 'asc' | 'desc' } | null = null;
  if (grauAtivo.value) {
    orderParams = { key: 'grau', order: ordemGrau.value };
  } else if (duracaoAtivo.value) {
    orderParams = { key: 'duracao', order: ordemDuracao.value };
  } else if (extensaoAtivo.value) {
    orderParams = { key: 'extensao', order: ordemExtensao.value };
  } else if (dataAtivo.value) {
    orderParams = { key: 'data', order: ordemData.value };
  }
  if (orderParams) {
    emit('sort', orderParams);
  }
};

const resetaOrdenacoes = () => {
  grauAtivo.value = false;
  duracaoAtivo.value = false;
  extensaoAtivo.value = false;
  dataAtivo.value = false;
  ordemGrau.value = 'desc';
  ordemDuracao.value = 'desc';
  ordemExtensao.value = 'desc';
  ordemData.value = 'asc';
  emit('reset');
};

const fechaMenuOrdenacao = () => {
  emit('close');
};

const emit = defineEmits<{(e: 'sort', params: { key: keyof Via; order: 'asc' | 'desc' }): void; (e: 'reset'): void; (e: 'close'): void }>();
</script>

<style scoped>
.modal-card {
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid #1b5e20;
}

.sort-options {
  margin: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #1b5e20;
}

.q-gutter-sm {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.sort-icon {
  font-size: 32px;
  cursor: pointer;
}

.sort-icon.active {
  color: #f50057;
}

.sort-icon:hover {
  color: #f50057;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.sort-label {
  font-size: 20px;
  font-weight: bold;
  margin-right: 8px;
}

</style>
