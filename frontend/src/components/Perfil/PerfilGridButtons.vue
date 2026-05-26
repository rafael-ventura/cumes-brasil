<template>
  <div class="container-estatisticas">
    <component
      v-for="(item, indice) in itens"
      :key="indice"
      :is="itemEhLink(item) ? 'router-link' : 'div'"
      :to="itemEhLink(item) ? item.to : undefined"
      :class="['cartao-estatistica', { 'cartao-estatistica--somente-leitura': somenteLeitura && !itemEhLink(item) }]"
      :style="{ '--cor-destaque': item.color }"
      @click="aoClicarCartao(item)"
    >
      <div class="estatistica-conteudo">
        <i :class="item.icon" class="estatistica-icone" />
        <span class="estatistica-numero">{{ item.num }}</span>
        <span class="estatistica-rotulo">{{ item.label }}</span>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">

interface ItemEstatistica {
  label: string;
  num: number;
  icon: string;
  color: string;
  to: string;
}

const props = defineProps<{
  itens: ItemEstatistica[];
  somenteLeitura?: boolean;
}>();

const emit = defineEmits<{
  (e: 'clique-item', item: ItemEstatistica): void;
}>();

/** Navega apenas quando `to` é uma rota real (não `#`). */
function itemEhLink(item: ItemEstatistica) {
  return item.to && item.to !== '#';
}

function aoClicarCartao(item: ItemEstatistica) {
  if (itemEhLink(item)) return;
  emit('clique-item', item);
}
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.container-estatisticas {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  flex-wrap: nowrap;

  @media (min-width: 1024px) {
    gap: 10px;
  }
}

.cartao-estatistica {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  background: hsla(80, 15%, 14%, 0.6);
  border: 1px solid hsla(80, 15%, 22%, 0.9);
  transition: background 0.2s ease, transform 0.15s ease, border-color 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  padding: 12px 16px;
  color: inherit;
  min-width: 0;
  flex: 1 1 0;
  margin: 0 !important;

  &--somente-leitura {
    cursor: default;
  }

  &:hover:not(.cartao-estatistica--somente-leitura) {
    transform: translateY(-3px);
    background: hsla(80, 20%, 20%, 0.75);
    border-color: hsla(80, 40%, 38%, 0.4);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 1024px) {
    padding: 12px 8px 10px;
    border-radius: 14px;
  }
}

.estatistica-conteudo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  white-space: nowrap;
  min-width: 0;
}

.estatistica-numero {
  font-size: 24px;
  font-weight: 800;
  color: var(--cor-destaque);
  line-height: 1;
  font-family: 'Sora', sans-serif;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    font-size: 26px;
  }

  margin-right: 10px;
}

.estatistica-icone {
  font-size: 12px;
  color: var(--cor-destaque);
  opacity: 0.95;
  transition: color 0.2s ease;
  flex-shrink: 0;
  margin-right: 2px;

  @media (min-width: 1024px) {
    font-size: 13px;
  }
}

.estatistica-rotulo {
  font-size: 11px;
  font-weight: 600;
  color: hsl(45 10% 55%);
  white-space: nowrap;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  margin-left: 2px;

  @media (min-width: 1024px) {
    font-size: 12px;
  }
}

.cartao-estatistica:hover:not(.cartao-estatistica--somente-leitura) {
  border-color: hsla(80, 40%, 38%, 0.35);
}
</style>
