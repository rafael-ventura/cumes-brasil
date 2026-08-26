<template>
  <router-link
    :to="{ name: 'EscaladaDetalhada', params: { id: String(escalada.id) } }"
    class="marcacao-card"
  >
    <div class="marcacao-card__thumb">
      <img
        v-if="urlImagem"
        :src="urlImagem"
        alt=""
        class="marcacao-card__img"
      />
      <div v-else class="marcacao-card__placeholder">
        <q-icon name="terrain" size="22px" />
      </div>
    </div>
    <div class="marcacao-card__body">
      <div class="marcacao-card__via">{{ nomeVia }}</div>
      <div class="marcacao-card__meta">
        <span class="marcacao-card__data">{{ dataFormatada }}</span>
        <span v-if="textoAutor" class="marcacao-card__sep">·</span>
        <span v-if="textoAutor" class="marcacao-card__autor">{{ textoAutor }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Escalada } from 'src/models/Escalada';
import type { Via } from 'src/models/Via';
import { getViaImageUrlComFallbackFull } from 'src/utils/utils';

const props = defineProps<{
  escalada: Escalada;
}>();

const viaObj = computed((): Via | null => {
  const v = props.escalada.via;
  if (v && typeof v === 'object') return v as Via;
  return null;
});

const nomeVia = computed(() => viaObj.value?.nome || 'Via');

const urlImagem = computed(() => getViaImageUrlComFallbackFull(viaObj.value));

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

.marcacao-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  background: rgba($offwhite, 0.04);
  border: 1px solid rgba($cumes-01, 0.18);
  overflow: hidden;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.2s ease;

  &:hover {
    background: rgba($cumes-01, 0.12);
    border-color: rgba($cumes-03, 0.35);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.marcacao-card__thumb {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid rgba($offwhite, 0.1);
}

.marcacao-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.marcacao-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($offwhite, 0.06);
  color: rgba($offwhite, 0.35);
}

.marcacao-card__body {
  padding: 10px 12px 12px;
  min-width: 0;
}

.marcacao-card__via {
  font-weight: 700;
  font-size: 14px;
  color: $cumes-01;
  letter-spacing: -0.02em;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.marcacao-card__meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba($offwhite, 0.48);
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.marcacao-card__sep {
  opacity: 0.5;
}

.marcacao-card__autor {
  color: rgba($offwhite, 0.55);
}
</style>
