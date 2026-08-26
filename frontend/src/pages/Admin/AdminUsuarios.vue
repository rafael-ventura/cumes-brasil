<template>
  <q-page class="admin-page">
    <!-- Cabeçalho (q-page é shell/layout; widgets são PrimeVue) -->
    <div class="page-header">
      <Button
        icon="pi pi-arrow-left"
        text rounded
        class="btn-voltar"
        aria-label="Voltar"
        @click="$router.push('/admin')"
      />
      <i class="pi pi-users page-icon" />
      <h1 class="page-titulo">Usuários</h1>
      <div class="header-spacer" />
      <Tag
        v-if="estatisticas"
        :value="`${estatisticas.admins} admin(s) / ${estatisticas.total}`"
        class="stat-tag"
      />
    </div>

    <DataTable
      :value="usuariosFiltrados"
      :loading="carregando"
      paginator
      :rows="10"
      :rows-per-page-options="[10, 25, 50]"
      data-key="id"
      removable-sort
      class="tabela-usuarios"
    >
      <template #header>
        <div class="tabela-busca">
          <i class="pi pi-search" />
          <InputText
            v-model="busca"
            placeholder="Buscar por nome, username ou email..."
            class="campo-busca"
          />
        </div>
      </template>

      <template #empty>
        <div class="estado-vazio">
          <i class="pi pi-search" />
          <span>Nenhum usuário encontrado</span>
        </div>
      </template>

      <Column field="nome" header="Usuário" sortable>
        <template #body="{ data }">
          <div class="cel-usuario">
            <span class="usuario-nome">
              {{ data.nome }}
              <span v-if="data.id === usuarioLogadoId" class="tag-voce">você</span>
            </span>
            <span class="usuario-meta">@{{ data.username }} · {{ data.email }}</span>
          </div>
        </template>
      </Column>

      <Column field="role" header="Papel" sortable class="col-papel">
        <template #body="{ data }">
          <Tag :value="rotuloPapel(data.role)" :class="`papel-tag papel--${data.role}`" />
        </template>
      </Column>

      <Column header="Alterar papel" class="col-acao">
        <template #body="{ data }">
          <Select
            :model-value="data.role"
            :options="opcoesPapel"
            option-label="label"
            option-value="value"
            :disabled="data.id === usuarioLogadoId || salvandoId === data.id"
            :loading="salvandoId === data.id"
            class="select-papel"
            @update:model-value="(val: string) => alterarPapel(data, val)"
          />
        </template>
      </Column>
    </DataTable>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { api } from 'boot/axios';
import { handleApiError } from 'src/utils/utils';
import AuthenticateService from 'src/services/AuthenticateService';

interface UsuarioAdmin {
  id: number;
  nome: string;
  username: string;
  email: string;
  role: 'usuario' | 'moderador' | 'admin';
  is_admin: boolean;
  perfil_publico: boolean;
}

const router = useRouter();
const $q = useQuasar();

const carregando = ref(true);
const usuarios = ref<UsuarioAdmin[]>([]);
const estatisticas = ref<{ total: number; admins: number } | null>(null);
const busca = ref('');
const salvandoId = ref<number | null>(null);
const usuarioLogadoId = Number(localStorage.getItem('usuarioId')) || -1;

const opcoesPapel = [
  { label: 'Usuário', value: 'usuario' },
  { label: 'Moderador', value: 'moderador' },
  { label: 'Admin', value: 'admin' }
];

function rotuloPapel (role: string): string {
  return opcoesPapel.find(o => o.value === role)?.label ?? role;
}

const usuariosFiltrados = computed(() => {
  if (!busca.value.trim()) return usuarios.value;
  const termo = busca.value.toLowerCase();
  return usuarios.value.filter(u =>
    u.nome?.toLowerCase().includes(termo) ||
    u.username?.toLowerCase().includes(termo) ||
    u.email?.toLowerCase().includes(termo)
  );
});

onMounted(async () => {
  await AuthenticateService.sincronizarPrivilegiosSessao();
  if (!AuthenticateService.isAdmin()) {
    router.push('/');
    return;
  }
  await carregar();
});

async function carregar () {
  carregando.value = true;
  try {
    const [resUsuarios, resStats] = await Promise.all([
      api.get('/admin/usuarios'),
      api.get('/admin/usuarios/estatisticas')
    ]);
    usuarios.value = resUsuarios.data ?? [];
    estatisticas.value = resStats.data ?? null;
  } catch (err) {
    handleApiError(err, 'Erro ao carregar usuários');
  } finally {
    carregando.value = false;
  }
}

async function alterarPapel (usuario: UsuarioAdmin, novoPapel: string) {
  if (novoPapel === usuario.role) return;
  salvandoId.value = usuario.id;
  try {
    const res = await api.patch(`/admin/usuarios/${usuario.id}/papel`, { role: novoPapel });
    const idx = usuarios.value.findIndex(u => u.id === usuario.id);
    if (idx !== -1) {
      usuarios.value[idx] = { ...usuarios.value[idx], role: res.data.role, is_admin: res.data.is_admin };
    }
    $q.notify({
      type: 'positive',
      message: `${usuario.nome} agora é ${rotuloPapel(novoPapel)}.`,
      position: 'top-right'
    });
    const resStats = await api.get('/admin/usuarios/estatisticas');
    estatisticas.value = resStats.data ?? estatisticas.value;
  } catch (err) {
    handleApiError(err, 'Erro ao alterar papel do usuário');
  } finally {
    salvandoId.value = null;
  }
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
.stat-tag {
  background: rgba($cumes-01, 0.15) !important;
  color: $cumes-04 !important;
  border: 1px solid rgba($cumes-01, 0.3);
  font-weight: 700;
}

// Busca no header da tabela
.tabela-busca {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .pi-search { color: rgba($offwhite, 0.5); }
}
.campo-busca { flex: 1; }

// Célula de usuário
.cel-usuario { display: flex; flex-direction: column; gap: 2px; }
.usuario-nome {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: $offwhite;
}
.tag-voce {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  color: $cumes-03; border: 1px solid rgba($cumes-03, 0.5); border-radius: 6px; padding: 1px 6px;
}
.usuario-meta { font-size: 12px; color: rgba($offwhite, 0.45); }

.estado-vazio {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 32px; color: rgba($offwhite, 0.4);
  .pi { font-size: 32px; }
}

// Badge de papel
.papel-tag {
  font-weight: 700 !important; font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.5px;
  &.papel--admin     { background: $cumes-01 !important; color: $offwhite !important; }
  &.papel--moderador { background: $cumes-03 !important; color: $background !important; }
  &.papel--usuario   { background: rgba($offwhite, 0.12) !important; color: rgba($offwhite, 0.7) !important; }
}

.select-papel { min-width: 150px; }

/* ── Tema escuro para os componentes PrimeVue (v4) ── */
.tabela-usuarios {
  :deep(.p-datatable-header) {
    background: transparent;
    border: none;
    padding: 0 0 14px;
  }

  :deep(.p-datatable-table) {
    border-collapse: separate;
    border-spacing: 0 8px;
  }

  :deep(.p-datatable-thead > tr > th) {
    background: transparent;
    color: $cumes-04;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border: none;
    padding: 6px 16px;
  }

  :deep(.p-datatable-tbody > tr) {
    background: rgba($surface, 0.7);
  }

  :deep(.p-datatable-tbody > tr > td) {
    background: inherit;
    border: none;
    border-top: 1px solid rgba($cumes-01, 0.12);
    border-bottom: 1px solid rgba($cumes-01, 0.12);
    padding: 12px 16px;

    &:first-child { border-left: 1px solid rgba($cumes-01, 0.12); border-radius: 12px 0 0 12px; }
    &:last-child  { border-right: 1px solid rgba($cumes-01, 0.12); border-radius: 0 12px 12px 0; }
  }

  :deep(.p-datatable-tbody > tr:hover > td) {
    background: rgba($cumes-01, 0.05);
  }

  // Cabeçalho ordenável
  :deep(.p-sortable-column.p-highlight),
  :deep(.p-sortable-column:hover) {
    color: $cumes-01;
  }
  :deep(.p-sortable-column-icon) { color: $cumes-03; }

  // Spinner de loading
  :deep(.p-datatable-loading-overlay) { background: rgba($background, 0.6); }
  :deep(.p-datatable-loading-icon),
  :deep(.p-icon) { color: $cumes-01; }
}

// InputText (busca) — tema escuro
:deep(.campo-busca.p-inputtext) {
  width: 100%;
  background: rgba($offwhite, 0.05);
  border: 1px solid rgba($cumes-01, 0.3);
  border-radius: 10px;
  color: $offwhite;
  padding: 8px 12px;

  &::placeholder { color: rgba($offwhite, 0.4); }
  &:focus { border-color: $cumes-03; box-shadow: none; }
}

// Select de papel — tema escuro (fundo claro, contraste)
.select-papel {
  :deep(.p-select) {
    background: $offwhite;
    border: 2px solid $cumes-01;
    border-radius: 8px;
    min-height: 36px;
    box-shadow: none;
  }
  :deep(.p-select-label) { color: $background; font-weight: 600; padding: 6px 10px; }
  :deep(.p-select-dropdown) { color: $background; }
}

// Overlay do Select (dropdown aberto) — precisa de :global pois renderiza no body
:global(.p-select-overlay) {
  background: $background !important;
  border: 1px solid rgba($cumes-03, 0.35) !important;
  border-radius: 12px !important;
}
:global(.p-select-overlay .p-select-option) {
  color: $offwhite !important;
  font-weight: 600 !important;
  &:hover { background: rgba($cumes-03, 0.15) !important; }
}
:global(.p-select-overlay .p-select-option.p-select-option-selected) {
  background: rgba($cumes-03, 0.25) !important;
  color: $offwhite !important;
}

// Paginator interno do DataTable
.tabela-usuarios :deep(.p-paginator) {
  background: transparent;
  margin-top: 12px;

  .p-paginator-page,
  .p-paginator-prev,
  .p-paginator-next,
  .p-paginator-first,
  .p-paginator-last {
    color: rgba($offwhite, 0.95);
    border: 1px solid rgba($cumes-03, 0.35);
    border-radius: 10px;
    min-width: 32px;
    height: 32px;
    margin: 0 2px;
  }
  .p-paginator-page.p-paginator-page-selected,
  .p-paginator-page.p-highlight {
    background: $cumes-03;
    color: $offwhite;
    border-color: $cumes-03;
  }
}
</style>
