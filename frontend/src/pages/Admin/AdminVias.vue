<template>
  <q-page class="admin-page">
    <div class="page-header">
      <q-btn flat round icon="arrow_back" class="btn-voltar" @click="$router.push('/admin')" />
      <q-icon name="terrain" size="26px" class="page-icon" />
      <h1 class="page-titulo">Gerenciar Vias</h1>
      <q-space />
      <q-btn
        icon="add"
        label="Nova via"
        class="btn-nova-via"
        unelevated no-caps
        @click="abrirNova"
      />
    </div>

    <!-- Busca rápida -->
    <q-input
      v-model="busca"
      outlined
      dense
      placeholder="Buscar via por nome..."
      class="campo-busca"
      clearable
    >
      <template #prepend><q-icon name="search" color="orange-5" /></template>
    </q-input>

    <div v-if="carregando" class="estado-carregando">
      <q-spinner size="40px" color="orange" />
    </div>

    <div v-else class="vias-lista">
      <div v-for="via in viasFiltradas" :key="via.id" class="via-row">
        <div class="via-info">
          <span class="via-nome">{{ via.nome }}</span>
          <span class="via-meta">ID {{ via.id }}</span>
        </div>
        <div class="via-acoes">
          <q-btn flat round icon="edit" class="btn-editar" @click="abrirEdicao(via)" />
        </div>
      </div>

      <div v-if="viasFiltradas.length === 0 && !carregando" class="estado-vazio">
        <q-icon name="search_off" size="36px" />
        <span>Nenhuma via encontrada</span>
      </div>
    </div>

    <!-- Modal criar/editar via (campos principais) -->
    <q-dialog v-model="modalAberto" @hide="aoFecharModal">
      <q-card class="modal-card">
        <q-card-section class="modal-header">
          <div class="modal-title">
            <q-icon name="terrain" size="24px" class="title-icon" />
            <span>{{ modoEdicao ? 'Editar Via' : 'Nova Via' }}</span>
          </div>
          <q-btn flat round icon="close" class="btn-fechar" v-close-popup />
        </q-card-section>

        <q-card-section class="modal-body">
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Nome *</label>
              <q-input v-model="form.nome" outlined dense class="custom-input" />
            </div>
            <div class="form-field">
              <label class="field-label">Grau</label>
              <q-input v-model="form.grau" outlined dense class="custom-input" />
            </div>
            <div class="form-field form-field--full">
              <label class="field-label">Historia / Resumo</label>
              <q-input v-model="form.historia_resumo" outlined dense autogrow class="custom-input" />
            </div>
            <div class="form-field">
              <label class="field-label">Extensão (m)</label>
              <q-input v-model.number="form.extensao" type="number" outlined dense class="custom-input" />
            </div>
            <div class="form-field">
              <label class="field-label">Numero de Vias</label>
              <q-input v-model.number="form.numero_de_vias" type="number" outlined dense class="custom-input" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn label="Cancelar" class="btn-secondary-custom" v-close-popup unelevated no-caps />
          <q-btn
            :label="modoEdicao ? 'Salvar alterações' : 'Criar via'"
            class="btn-primary-custom"
            unelevated no-caps
            :loading="salvando"
            :disable="!form.nome?.trim()"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';

const $q = useQuasar();
const carregando = ref(true);
const vias = ref<any[]>([]);
const busca = ref('');
const modalAberto = ref(false);
const modoEdicao = ref(false);
const salvando = ref(false);
const form = ref<any>({});

const viasFiltradas = computed(() => {
  if (!busca.value.trim()) return vias.value;
  const q = busca.value.toLowerCase();
  return vias.value.filter(v => v.nome?.toLowerCase().includes(q));
});

onMounted(carregar);

async function carregar () {
  carregando.value = true;
  try {
    const res = await api.get('/admin/vias', { params: { limit: 500 } });
    vias.value = res.data.items ?? [];
  } catch (err) {
    handleApiError(err, 'Erro ao carregar vias');
  } finally {
    carregando.value = false;
  }
}

function abrirNova () {
  modoEdicao.value = false;
  form.value = { nome: '', grau: '', historia_resumo: '', extensao: null, numero_de_vias: null };
  modalAberto.value = true;
}

function abrirEdicao (via: any) {
  modoEdicao.value = true;
  form.value = { ...via };
  modalAberto.value = true;
}

async function salvar () {
  if (!form.value.nome?.trim()) return;
  salvando.value = true;
  try {
    if (modoEdicao.value) {
      await api.put(`/admin/vias/${form.value.id}`, form.value);
      const idx = vias.value.findIndex(v => v.id === form.value.id);
      if (idx !== -1) vias.value[idx] = { ...vias.value[idx], ...form.value };
      $q.notify({ type: 'positive', message: 'Via atualizada.', position: 'top-right' });
    } else {
      const res = await api.post('/admin/vias', form.value);
      vias.value.unshift(res.data);
      $q.notify({ type: 'positive', message: 'Via criada.', position: 'top-right' });
    }
    modalAberto.value = false;
  } catch (err) {
    handleApiError(err, 'Erro ao salvar via');
  } finally {
    salvando.value = false;
  }
}

function aoFecharModal () {
  form.value = {};
}
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.admin-page { max-width: 900px; margin: 0 auto; padding: 24px 16px; }

.page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.btn-voltar { color: rgba($offwhite, 0.7) !important; }
.page-icon { color: $cumes-01; }
.page-titulo { font-size: 20px; font-weight: 800; color: $offwhite; margin: 0; flex: 1; }
.btn-nova-via { background: $cumes-01 !important; color: $offwhite !important; border-radius: 10px !important; font-weight: 700 !important; }

.campo-busca {
  margin-bottom: 16px;
  :deep(.q-field__control) { background: rgba($offwhite, 0.05); border-radius: 10px; &::before { border-color: rgba($cumes-01, 0.3); } }
  :deep(.q-field__native) { color: $offwhite; }
  :deep(input::placeholder) { color: rgba($offwhite, 0.4); }
}

.estado-carregando, .estado-vazio { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: rgba($offwhite, 0.4); }

.vias-lista { display: flex; flex-direction: column; gap: 8px; }

.via-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba($surface, 0.7);
  border: 1px solid rgba($cumes-01, 0.12);
  border-radius: 12px;
  transition: background 0.15s;
  &:hover { background: rgba($cumes-01, 0.05); }
}
.via-info { flex: 1; }
.via-nome { display: block; font-size: 14px; font-weight: 700; color: $offwhite; }
.via-meta { font-size: 11px; color: rgba($offwhite, 0.4); }
.via-acoes { display: flex; gap: 4px; }
.btn-editar { color: $cumes-03 !important; }

// Modal
.modal-card {
  background-color: $background;
  border: 2px solid $cumes-01;
  border-radius: 16px;
  width: 92vw;
  max-width: 580px;
  @media (min-width: 768px) { width: 580px; }
}
.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  border-radius: 14px 14px 0 0;
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title { display: flex; align-items: center; gap: 10px; color: $offwhite; font-size: 16px; font-weight: 700; }
.title-icon { color: $cumes-04; }
.btn-fechar { color: $offwhite !important; }
.modal-body { padding: 20px; }
.modal-actions { padding: 12px 20px; border-top: 1px solid rgba($cumes-01, 0.2); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; &--full { grid-column: 1 / -1; } }
.field-label { font-size: 12px; font-weight: 700; color: $cumes-04; text-transform: uppercase; letter-spacing: 0.8px; }
.custom-input {
  :deep(.q-field__control) { background-color: $offwhite; border-radius: 8px; padding: 0 !important; &::before { border-color: $cumes-01; border-width: 2px; } }
  :deep(.q-field__native) { color: $background; padding: 10px 14px !important; }
  :deep(input) { padding: 10px 14px !important; }
}
.btn-primary-custom { background: $cumes-01 !important; color: $offwhite !important; border-radius: 8px !important; font-weight: 700 !important; padding: 10px 24px !important; &:disabled { opacity: 0.4 !important; } }
.btn-secondary-custom { background: transparent !important; color: $cumes-01 !important; border: 2px solid $cumes-01 !important; border-radius: 8px !important; padding: 10px 24px !important; }
</style>
