<template>
  <div class="topbar">
    <!-- Logo/Header -->
    <div class="logo-container" @click="goTo('/')">
      <i class="pi pi-map logo-icon"></i>
      <span class="logo-text">Cumes Brasil</span>
    </div>

    <!-- Menu Items -->
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
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Menu items
const menuItems = [
  { path: '/', icon: 'pi-home', label: 'Home' },
  { path: '/busca', icon: 'pi-search', label: 'Buscar' },
  { path: '/colecoes', icon: 'pi-bookmark', label: 'Coleções' },
  { path: '/perfil', icon: 'pi-user', label: 'Perfil' }
];

const goTo = (path: string) => {
  router.push(path);
};

const isSelected = (path: string) => {
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
  background: $cumes-01;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 1000;
}

// ============================================
// LOGO
// ============================================
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .logo-icon {
    font-size: 28px;
    color: $cumes-04;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: $offwhite;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
}

// ============================================
// MENU
// ============================================
.topbar-menu {
  display: flex;
  align-items: center;
  gap: 8px;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .menu-icon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      transition: all 0.3s ease;
    }

    .menu-label {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
    }

    &.menu-item-active {
      background: linear-gradient(135deg,
        rgba($cumes-04, 0.3) 0%,
        rgba($cumes-04, 0.15) 100%
      );
      box-shadow: 0 2px 10px rgba($cumes-04, 0.3);

      .menu-icon {
        color: $cumes-04;
        transform: scale(1.1);
      }

      .menu-label {
        color: $offwhite;
        font-weight: 600;
      }
    }
  }
}

// ============================================
// RESPONSIVIDADE
// ============================================
@media (max-width: 768px) {
  .topbar {
    padding: 0 20px;
    height: 60px;
  }

  .logo-container {
    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      font-size: 16px;
    }
  }

  .topbar-menu {
    gap: 4px;

    .menu-item {
      padding: 8px 12px;

      .menu-label {
        display: none; // Esconder labels no mobile
      }
    }
  }
}
</style>

