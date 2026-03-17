<template>
  <span
    v-if="via?.via_cerj"
    class="badge-cerj"
  >
    <img
      v-if="showLogo"
      :src="cerjLogo"
      alt="CERJ"
      class="badge-cerj-logo"
    />
    <q-icon v-else-if="showIcon" name="emoji_events" size="14px" class="badge-cerj-icon" />
    <span class="badge-cerj-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { Via } from 'src/models/Via';
import cerjLogo from 'src/assets/cerj-logo.png';

withDefaults(
  defineProps<{
    via: Via | null | undefined;
    label?: string;
    showIcon?: boolean;
    showLogo?: boolean;
  }>(),
  {
    label: 'Clássica CERJ',
    showIcon: true,
    showLogo: true
  }
);
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

// Cores do logo CERJ: azul escuro e branco
$cerj-azul: #1a3a5c;
$cerj-azul-claro: #2a4a6c;
$cerj-branco: #ffffff;

.badge-cerj {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, $cerj-azul 0%, $cerj-azul-claro 100%) !important;
  color: $cerj-branco !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  padding: 4px 10px !important;
  border-radius: 8px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 2px 6px rgba(26, 58, 92, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.badge-cerj-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.badge-cerj-icon {
  margin-right: 2px;
}

.badge-cerj-label {
  line-height: 1;
}
</style>
