<template>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="logo-container" @click="goTo('/')">
        <i class="pi pi-map logo-icon"></i>
        <span class="logo-text">Cumes Brasil</span>
      </div>

      <nav class="topbar-menu">
        <div
          v-for="item in menuItems"
          :key="item.path"
          @click="goTo(item.path)"
          :class="['menu-item', { 'menu-item-active': isSelected(item.path) }]"
        >
          <i :class="`pi ${item.icon} menu-icon`"></i>
          <span class="menu-label">{{ item.label }}</span>
        </div>
        <div
          v-if="eAdmin"
          @click="goTo('/admin')"
          :class="['menu-item', 'menu-item-admin', { 'menu-item-active': isSelected('/admin') }]"
        >
          <i class="pi pi-shield menu-icon"></i>
          <span class="menu-label">Admin</span>
        </div>
        <div
          @click="irParaPerfil"
          :class="['menu-item', { 'menu-item-active': isSelected('/perfil') }]"
        >
          <i class="pi pi-user menu-icon"></i>
          <span class="menu-label">Perfil</span>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthenticateService from 'src/services/AuthenticateService';

const eAdmin = ref(AuthenticateService.isAdmin());

onMounted(async () => {
  if (AuthenticateService.isTokenValid()) {
    await AuthenticateService.sincronizarPrivilegiosSessao();
    eAdmin.value = AuthenticateService.isAdmin();
  }
});

const router = useRouter();
const route = useRoute();

const menuItems = [
  { path: '/', icon: 'pi-home', label: 'Home' },
  { path: '/explorar', icon: 'pi-compass', label: 'Explorar' },
  { path: '/colecoes', icon: 'pi-bookmark', label: 'Coleções' },
];

const goTo = (path: string) => {
  router.push(path);
};

const irParaPerfil = () => {
  const username = AuthenticateService.getUsername();
  router.push(username ? `/perfil/${username}` : '/perfil/me');
};

const isSelected = (path: string) => {
  if (path === '/explorar') {
    return route.path === '/explorar' || route.path === '/busca';
  }
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

// ============================================
// TOPBAR HORIZONTAL
// ============================================
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba($background, 0.84);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba($cumes-01, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
}

.topbar-inner {
  width: 100%;
  max-width: 1120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  .logo-icon {
    font-size: 22px;
    color: $cumes-01;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: $offwhite;
    letter-spacing: -0.015em;
    white-space: nowrap;
  }
}

.topbar-menu {
  display: flex;
  align-items: center;
  gap: 6px;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 14px;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: rgba($offwhite, 0.07);
      border-color: rgba($offwhite, 0.12);
      transform: translateY(-1px);
    }

    .menu-icon {
      font-size: 14px;
      color: rgba($offwhite, 0.65);
      transition: color 0.2s ease;
    }

    .menu-label {
      font-size: 13px;
      font-weight: 600;
      color: rgba($offwhite, 0.8);
      transition: color 0.2s ease;
    }

    &.menu-item-active {
      background: rgba($cumes-01, 0.2);
      border-color: rgba($cumes-01, 0.55);

      .menu-icon {
        color: $cumes-04;
      }

      .menu-label {
        color: $offwhite;
        font-weight: 700;
      }
    }

    &.menu-item-admin {
      border-color: rgba($cumes-05, 0.3);
      .menu-icon { color: $cumes-05; }
      .menu-label { color: rgba($offwhite, 0.75); }
      &:hover { background: rgba($cumes-05, 0.1); border-color: rgba($cumes-05, 0.5); }
      &.menu-item-active { background: rgba($cumes-05, 0.15); border-color: $cumes-05; .menu-icon { color: $cumes-05; } }
    }
  }
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
    height: 60px;
  }

  .topbar-inner {
    max-width: 100%;
  }

  .logo-container {
    .logo-icon {
      font-size: 20px;
    }

    .logo-text {
      font-size: 15px;
    }
  }

  .topbar-menu {
    gap: 4px;

    .menu-item {
      padding: 8px 10px;

      .menu-label {
        display: none;
      }
    }
  }
}
</style>

