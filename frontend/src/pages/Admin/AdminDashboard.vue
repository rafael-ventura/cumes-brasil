<template>
  <q-page class="admin-page">
    <div class="admin-header">
      <q-icon name="admin_panel_settings" size="32px" class="admin-icon" />
      <div>
        <h1 class="admin-titulo">Painel de Administração</h1>
        <p class="admin-subtitulo">Bem-vindo, {{ username }}</p>
      </div>
    </div>

    <div class="admin-cards">
      <div
        v-for="card in cards"
        :key="card.rota"
        class="admin-card"
        @click="$router.push(card.rota)"
      >
        <q-icon :name="card.icone" size="36px" class="card-icone" />
        <div class="card-info">
          <span class="card-titulo">{{ card.titulo }}</span>
          <span class="card-descricao">{{ card.descricao }}</span>
        </div>
        <q-badge v-if="card.badge" :label="card.badge" color="orange" class="card-badge" />
        <q-icon name="chevron_right" size="20px" class="card-seta" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';
import ViaImageSugestaoService from 'src/services/ViaImageSugestaoService';

const router = useRouter();
const username = AuthenticateService.getUsername() ?? 'admin';
const pendentes = ref(0);

onMounted(async () => {
  await AuthenticateService.sincronizarPrivilegiosSessao();
  if (!AuthenticateService.isAdmin()) {
    router.push('/');
    return;
  }
  const lista = await ViaImageSugestaoService.listarPendentesAdmin();
  pendentes.value = lista.length;
});

const cards = computed(() => [
  {
    rota: '/admin/sugestoes',
    icone: 'photo_library',
    titulo: 'Sugestões de Fotos',
    descricao: 'Aprovar ou rejeitar fotos enviadas por usuários',
    badge: pendentes.value > 0 ? pendentes.value : null
  },
  {
    rota: '/admin/vias',
    icone: 'terrain',
    titulo: 'Gerenciar Vias',
    descricao: 'Criar, editar e remover vias do catálogo',
    badge: null
  },
  {
    rota: '/admin/usuarios',
    icone: 'manage_accounts',
    titulo: 'Usuários',
    descricao: 'Visualizar e gerenciar permissões de usuários',
    badge: null
  }
]);
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.admin-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: rgba($cumes-01, 0.1);
  border: 1px solid rgba($cumes-01, 0.3);
  border-radius: 16px;
}

.admin-icon { color: $cumes-01; }
.admin-titulo {
  font-size: 22px;
  font-weight: 800;
  color: $offwhite;
  margin: 0;
}
.admin-subtitulo {
  font-size: 13px;
  color: rgba($offwhite, 0.6);
  margin: 2px 0 0;
}

.admin-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: rgba($surface, 0.8);
  border: 1px solid rgba($cumes-01, 0.2);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;

  &:hover {
    background: rgba($cumes-01, 0.08);
    border-color: rgba($cumes-01, 0.5);
    transform: translateX(4px);
  }
}

.card-icone { color: $cumes-01; flex-shrink: 0; }
.card-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.card-titulo { font-size: 15px; font-weight: 700; color: $offwhite; }
.card-descricao { font-size: 12px; color: rgba($offwhite, 0.55); }
.card-badge { font-weight: 700; }
.card-seta { color: rgba($offwhite, 0.3); flex-shrink: 0; }
</style>
