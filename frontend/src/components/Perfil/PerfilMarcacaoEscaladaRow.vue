<template>
  <router-link
    :to="{ name: 'EscaladaDetalhada', params: { id: String(escalada.id) } }"
    class="marcacao-row"
  >
    <div class="marcacao-row__thumb">
      <img
        v-if="urlImagem"
        :src="urlImagem"
        alt=""
        class="marcacao-row__img"
      />
      <div v-else class="marcacao-row__placeholder">
        <q-icon name="terrain" size="22px" />
      </div>
    </div>
    <div class="marcacao-row__body">
      <div class="marcacao-row__via">
        {{ nomeVia }}
      </div>
      <div class="marcacao-row__meta">
        <span class="marcacao-row__data">{{ dataFormatada }}</span>
        <span v-if="textoAutor" class="marcacao-row__sep">·</span>
        <span v-if="textoAutor" class="marcacao-row__autor">{{ textoAutor }}</span>
      </div>
    </div>
    <q-icon name="chevron_right" class="marcacao-row__chev" size="22px" />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Escalada } from 'src/models/Escalada';
import type { Via } from 'src/models/Via';
import { getViaImageUrlFull } from 'src/utils/utils';

type UsuarioResumo = { nome?: string; username?: string };

type EscaladaComRelacoes = Escalada & {
  usuario?: number | UsuarioResumo;
  via?: number | Via;
};

const props = defineProps<{
  escalada: EscaladaComRelacoes;
}>();

const viaObj = computed((): Via | null => {
  const v = props.escalada.via;
  if (v && typeof v === 'object') return v as Via;
  return null;
});

const nomeVia = computed(() => viaObj.value?.nome || 'Via');

const urlImagem = computed(() => getViaImageUrlFull(viaObj.value));

const dataFormatada = computed(() => {
  const d = props.escalada.data;
  if (!d) return '—';
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(dateObj.getTime())) return '—';
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
});

const textoAutor = computed(() => {
  const u = props.escalada.usuario;
  if (u && typeof u === 'object') {
    if (u.username?.trim()) return `por @${u.username}`;
    if (u.nome?.trim()) return `por ${u.nome}`;
  }
  return '';
});

defineOptions({ name: 'PerfilMarcacaoEscaladaRow' });
</script>

<style scoped lang="scss">
@import 'src/css/app.scss';

.marcacao-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  background: rgba($offwhite, 0.04);
  border: 1px solid rgba($cumes-01, 0.18);
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;

  &:hover {
    background: rgba($cumes-01, 0.12);
    border-color: rgba($cumes-03, 0.35);
  }

  &:active {
    transform: scale(0.99);
  }
}

.marcacao-row__thumb {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba($offwhite, 0.12);
}

.marcacao-row__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.marcacao-row__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($offwhite, 0.06);
  color: rgba($offwhite, 0.35);
}

.marcacao-row__body {
  flex: 1;
  min-width: 0;
}

.marcacao-row__via {
  font-weight: 700;
  font-size: 15px;
  color: $cumes-01;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.marcacao-row__meta {
  margin-top: 4px;
  font-size: 13px;
  color: rgba($offwhite, 0.48);
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.marcacao-row__sep {
  opacity: 0.5;
}

.marcacao-row__autor {
  color: rgba($offwhite, 0.55);
}

.marcacao-row__chev {
  flex-shrink: 0;
  color: rgba($offwhite, 0.25);
}
</style>
