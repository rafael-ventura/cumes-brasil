<template>
  <q-page class="admin-page">
    <div class="page-header">
      <Button icon="pi pi-arrow-left" text rounded class="btn-voltar" aria-label="Voltar" @click="$router.push('/admin')" />
      <i class="pi pi-map page-icon" />
      <h1 class="page-titulo">Gerenciar Vias</h1>
      <div class="header-spacer" />
      <Button icon="pi pi-plus" label="Nova via" class="btn-nova-via" @click="abrirNova" />
    </div>

    <DataTable
      :value="viasFiltradas"
      :loading="carregando"
      paginator
      :rows="15"
      :rows-per-page-options="[15, 30, 50]"
      data-key="id"
      removable-sort
      class="tabela-vias"
    >
      <template #header>
        <div class="tabela-busca">
          <i class="pi pi-search" />
          <InputText v-model="busca" placeholder="Buscar via por nome..." class="campo-busca" />
        </div>
      </template>

      <template #empty>
        <div class="estado-vazio">
          <i class="pi pi-search" />
          <span>Nenhuma via encontrada</span>
        </div>
      </template>

      <Column field="nome" header="Via" sortable>
        <template #body="{ data }">
          <span class="via-nome">{{ data.nome }}</span>
        </template>
      </Column>

      <Column field="id" header="ID" sortable class="col-id" />

      <Column header="Ações" class="col-acao">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" text rounded class="btn-editar" aria-label="Editar" @click="abrirEdicao(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Modal criar/editar via — q-dialog (shell de overlay) + widgets PrimeVue dentro -->
    <q-dialog v-model="modalAberto" @hide="aoFecharModal">
      <q-card class="modal-card">
        <q-card-section class="modal-header">
          <div class="modal-title">
            <i class="pi pi-map title-icon" />
            <span>{{ modoEdicao ? 'Editar Via' : 'Nova Via' }}</span>
          </div>
          <q-btn flat round icon="close" class="btn-fechar" v-close-popup />
        </q-card-section>

        <q-card-section class="modal-body">
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Nome *</label>
              <InputText v-model="form.nome" class="campo-form" />
            </div>
            <div class="form-field">
              <label class="field-label">Grau</label>
              <InputText v-model="form.grau" class="campo-form" />
            </div>
            <div class="form-field form-field--full">
              <label class="field-label">Historia / Resumo</label>
              <Textarea v-model="form.historia_resumo" auto-resize rows="3" class="campo-form" />
            </div>
            <div class="form-field">
              <label class="field-label">Extensão (m)</label>
              <InputNumber v-model="form.extensao" :use-grouping="false" class="campo-form" />
            </div>
            <div class="form-field">
              <label class="field-label">Numero de Vias</label>
              <InputNumber v-model="form.numero_de_vias" :use-grouping="false" class="campo-form" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <Button label="Cancelar" class="btn-secondary-custom" text v-close-popup />
          <Button
            :label="modoEdicao ? 'Salvar alterações' : 'Criar via'"
            class="btn-primary-custom"
            :loading="salvando"
            :disabled="!form.nome?.trim()"
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
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
.page-icon { color: $cumes-01; font-size: 24px; }
.page-titulo { font-size: 20px; font-weight: 800; color: $offwhite; margin: 0; }
.header-spacer { flex: 1; }
.btn-nova-via {
  background: $cumes-01 !important;
  border-color: $cumes-01 !important;
  color: $offwhite !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
}

.tabela-busca {
  display: flex; align-items: center; gap: 8px; width: 100%;
  .pi-search { color: rgba($offwhite, 0.5); }
}
.campo-busca { flex: 1; }
.via-nome { font-size: 14px; font-weight: 700; color: $offwhite; }
.col-id { color: rgba($offwhite, 0.5); }
.btn-editar { color: $cumes-03 !important; }

.estado-vazio {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 32px; color: rgba($offwhite, 0.4);
  .pi { font-size: 32px; }
}

/* ── DataTable tema escuro (mesmo padrão de AdminUsuarios) ── */
.tabela-vias {
  :deep(.p-datatable-header) { background: transparent; border: none; padding: 0 0 14px; }
  :deep(.p-datatable-table) { border-collapse: separate; border-spacing: 0 8px; }
  :deep(.p-datatable-thead > tr > th) {
    background: transparent; color: $cumes-04; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.6px; border: none; padding: 6px 16px;
  }
  :deep(.p-datatable-tbody > tr) { background: rgba($surface, 0.7); }
  :deep(.p-datatable-tbody > tr > td) {
    background: inherit; border: none;
    border-top: 1px solid rgba($cumes-01, 0.12); border-bottom: 1px solid rgba($cumes-01, 0.12);
    padding: 12px 16px;
    &:first-child { border-left: 1px solid rgba($cumes-01, 0.12); border-radius: 12px 0 0 12px; }
    &:last-child  { border-right: 1px solid rgba($cumes-01, 0.12); border-radius: 0 12px 12px 0; }
  }
  :deep(.p-datatable-tbody > tr:hover > td) { background: rgba($cumes-01, 0.05); }
  :deep(.p-sortable-column.p-highlight), :deep(.p-sortable-column:hover) { color: $cumes-01; }
  :deep(.p-sortable-column-icon) { color: $cumes-03; }
  :deep(.p-datatable-loading-overlay) { background: rgba($background, 0.6); }
  :deep(.p-datatable-loading-icon), :deep(.p-icon) { color: $cumes-01; }

  :deep(.p-paginator) {
    background: transparent; margin-top: 12px;
    .p-paginator-page, .p-paginator-prev, .p-paginator-next, .p-paginator-first, .p-paginator-last {
      color: rgba($offwhite, 0.95); border: 1px solid rgba($cumes-03, 0.35);
      border-radius: 10px; min-width: 32px; height: 32px; margin: 0 2px;
    }
    .p-paginator-page.p-paginator-page-selected, .p-paginator-page.p-highlight {
      background: $cumes-03; color: $offwhite; border-color: $cumes-03;
    }
  }
}

// InputText (busca) — tema escuro
:deep(.campo-busca.p-inputtext) {
  width: 100%; background: rgba($offwhite, 0.05); border: 1px solid rgba($cumes-01, 0.3);
  border-radius: 10px; color: $offwhite; padding: 8px 12px;
  &::placeholder { color: rgba($offwhite, 0.4); }
  &:focus { border-color: $cumes-03; box-shadow: none; }
}

/* ── Modal (q-dialog shell) ── */
.modal-card {
  background-color: $background; border: 2px solid $cumes-01; border-radius: 16px;
  width: 92vw; max-width: 580px;
  @media (min-width: 768px) { width: 580px; }
}
.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  border-radius: 14px 14px 0 0; display: flex; align-items: center; justify-content: space-between;
}
.modal-title { display: flex; align-items: center; gap: 10px; color: $offwhite; font-size: 16px; font-weight: 700; }
.title-icon { color: $cumes-04; font-size: 22px; }
.btn-fechar { color: $offwhite !important; }
.modal-body { padding: 20px; }
.modal-actions { padding: 12px 20px; border-top: 1px solid rgba($cumes-01, 0.2); display: flex; gap: 8px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; &--full { grid-column: 1 / -1; } }
.field-label { font-size: 12px; font-weight: 700; color: $cumes-04; text-transform: uppercase; letter-spacing: 0.8px; }

// Inputs PrimeVue dentro do modal — fundo claro (contraste no tema escuro)
.campo-form {
  width: 100%;
  :deep(.p-inputtext), &:deep(.p-inputtext) {
    width: 100%; background: $offwhite; color: $background; border: 2px solid $cumes-01;
    border-radius: 8px; padding: 10px 14px;
    &:focus { border-color: $cumes-03; box-shadow: none; }
  }
  // InputNumber embrulha um p-inputtext
  :deep(.p-inputnumber) { width: 100%; }
}

.btn-primary-custom {
  background: $cumes-01 !important; border-color: $cumes-01 !important; color: $offwhite !important;
  border-radius: 8px !important; font-weight: 700 !important; padding: 10px 24px !important;
  &:disabled { opacity: 0.4 !important; }
}
.btn-secondary-custom {
  color: $cumes-01 !important; border-radius: 8px !important; padding: 10px 24px !important;
}
</style>
