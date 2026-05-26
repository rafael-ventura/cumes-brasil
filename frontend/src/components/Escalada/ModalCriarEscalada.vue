<template>
  <q-dialog :model-value="props.isOpen" @update:model-value="handleClose">
    <q-card class="my-card">
      <q-card-section class="card-header">
        <div class="card-title">
          <q-icon name="add_circle" size="28px" class="title-icon" />
          <span>Registrar Escalada</span>
        </div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-form @submit.prevent="onSubmit" @reset="onReset" class="edit-form">

          <!-- Data e hora -->
          <div class="form-field">
            <label class="field-label">Data e hora da escalada *</label>
            <q-input
              v-model="dataHora"
              type="datetime-local"
              class="custom-input"
              outlined
              dense
              :rules="[ val => !!val || 'Campo obrigatório' ]"
            />
          </div>

          <!-- Observação -->
          <div class="form-field">
            <label class="field-label">Observação</label>
            <q-input
              v-model="observacao"
              type="textarea"
              class="custom-input"
              outlined
              dense
              rows="2"
              placeholder="Como foi a escalada? Condições, impressões..."
            />
          </div>

          <!-- Participantes -->
          <div class="participantes-section">
            <div class="participantes-titulo">
              <i class="pi pi-users" />
              <span>Participantes</span>
            </div>

            <div
              v-for="(participante, index) in participantes"
              :key="index"
              class="participante-card"
            >
              <div class="participante-header">
                <span class="participante-label">Participante {{ index + 1 }}</span>
                <q-btn
                  icon="close"
                  flat round dense size="sm"
                  class="remove-btn"
                  @click="removerParticipante(index)"
                />
              </div>

              <!-- Tipo -->
              <div class="form-field">
                <label class="field-label">Tipo *</label>
                <q-select
                  v-model="participante.tipo"
                  :options="tipoOptions"
                  class="custom-select"
                  outlined dense
                  :rules="[ val => !!val || 'Selecione um tipo' ]"
                />
              </div>

              <!-- Modo: usuário do site ou convidado -->
              <div class="participante-modo">
                <button
                  type="button"
                  :class="['modo-btn', { ativo: participante._modoUsername }]"
                  @click="participante._modoUsername = true; participante.nome = ''; participante.username = ''; participante._usuarioEncontrado = null; participante._usuarioSelecionado = null"
                >
                  <i class="pi pi-at" /> Usuário do site
                </button>
                <button
                  type="button"
                  :class="['modo-btn', { ativo: !participante._modoUsername }]"
                  @click="participante._modoUsername = false; participante.username = ''; participante._usuarioEncontrado = null"
                >
                  <i class="pi pi-user" /> Convidado
                </button>
              </div>

              <!-- Usuário cadastrado na plataforma -->
              <div v-if="participante._modoUsername" class="form-field">
                <label class="field-label">Usuário da plataforma *</label>
                <q-select
                  :model-value="participante._usuarioSelecionado"
                  :options="opcoesUsuariosPara(index)"
                  :loading="carregandoUsuarios"
                  class="custom-select usuario-select"
                  outlined
                  dense
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="0"
                  option-value="id"
                  :option-label="rotuloUsuarioOpcao"
                  emit-value
                  map-options
                  placeholder="Digite nome ou @username"
                  :rules="[ () => !!participante._usuarioEncontrado || 'Selecione um usuário' ]"
                  @filter="(val, update) => filtrarUsuariosParticipante(val, update, index)"
                  @update:model-value="(v) => aoSelecionarUsuarioPlataforma(participante, v)"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Nenhum usuário encontrado
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <div v-if="participante._usuarioEncontrado" class="busca-status encontrado">
                  <i class="pi pi-check-circle" /> {{ participante._usuarioEncontrado.nome }}
                  <span v-if="participante._usuarioEncontrado.username" class="username-tag">
                    @{{ participante._usuarioEncontrado.username }}
                  </span>
                </div>
              </div>

              <!-- Por nome livre -->
              <div v-else class="form-field">
                <label class="field-label">Nome *</label>
                <q-input
                  v-model="participante.nome"
                  class="custom-input"
                  outlined dense
                  placeholder="Nome do participante"
                  :rules="[ val => !!val || 'Nome obrigatório' ]"
                />
              </div>
            </div>

            <button type="button" class="btn-add-participante" @click="adicionarParticipante">
              <i class="pi pi-plus" /> Adicionar participante
            </button>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <q-btn
              type="submit"
              label="Registrar"
              icon="save"
              class="btn-primary-custom"
              unelevated no-caps
            />
            <q-btn
              type="reset"
              label="Limpar"
              class="btn-secondary-custom"
              unelevated no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EscaladaService from 'src/services/EscaladaService';
import UsuarioService from 'src/services/UsuarioService';
import { Notify } from 'quasar';
import AuthenticateService from 'src/services/AuthenticateService';
import type { IUsuario } from 'src/models/IUsuario';

interface ParticipanteLocal {
  tipo: string;
  nome: string;
  username: string;
  _modoUsername: boolean;
  _buscando: boolean;
  _buscaFeita: boolean;
  _usuarioEncontrado: { nome: string; username: string } | null;
  _usuarioSelecionado: number | null;
}

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'closeModal'): void }>();

const route = useRoute();
const router = useRouter();
const observacao = ref('');
const dataHora = ref(dataHoraAgora());
const participantes = ref<ParticipanteLocal[]>([novoParticipante()]);
const tipoOptions = ['GUIA', 'PARTICIPANTE', 'MISTO'];
const todosUsuarios = ref<IUsuario[]>([]);
const carregandoUsuarios = ref(false);
/** Texto digitado no filtro do q-select por índice de participante */
const filtroUsuarioPorParticipante = ref<Record<number, string>>({});

watch(
  () => props.isOpen,
  async (aberto) => {
    if (!aberto || todosUsuarios.value.length > 0) return;
    carregandoUsuarios.value = true;
    try {
      todosUsuarios.value = await UsuarioService.getAll();
    } catch {
      todosUsuarios.value = [];
    } finally {
      carregandoUsuarios.value = false;
    }
  }
);

function rotuloUsuarioOpcao(u: IUsuario) {
  const uName = u.username ? ` (@${u.username})` : '';
  return `${u.nome}${uName}`;
}

function opcoesUsuariosPara(indice: number): IUsuario[] {
  const termo = (filtroUsuarioPorParticipante.value[indice] || '').toLowerCase().trim();
  const meuId = localStorage.getItem('usuarioId');
  const base = todosUsuarios.value.filter((u) => !meuId || String(u.id) !== meuId);
  if (!termo) return base.slice(0, 80);
  return base
    .filter((u) => {
      const nome = (u.nome || '').toLowerCase();
      const un = (u.username || '').toLowerCase();
      return nome.includes(termo) || un.includes(termo);
    })
    .slice(0, 80);
}

function filtrarUsuariosParticipante(
  val: string,
  update: (fn?: () => void) => void,
  indice: number
) {
  filtroUsuarioPorParticipante.value = { ...filtroUsuarioPorParticipante.value, [indice]: val };
  update();
}

function aoSelecionarUsuarioPlataforma(p: ParticipanteLocal, usuarioId: number | null) {
  if (usuarioId == null) {
    p._usuarioSelecionado = null;
    p._usuarioEncontrado = null;
    p.nome = '';
    p.username = '';
    return;
  }
  const u = todosUsuarios.value.find((x) => x.id === usuarioId);
  if (!u) {
    p._usuarioEncontrado = null;
    return;
  }
  p._usuarioSelecionado = usuarioId;
  p._usuarioEncontrado = { nome: u.nome, username: u.username || '' };
  p.nome = u.nome;
  p.username = u.username || '';
}

function dataHoraAgora(): string {
  const agora = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
}

function novoParticipante(): ParticipanteLocal {
  return {
    tipo: '',
    nome: '',
    username: '',
    _modoUsername: false,
    _buscando: false,
    _buscaFeita: false,
    _usuarioEncontrado: null,
    _usuarioSelecionado: null
  };
}

const handleClose = () => emit('closeModal');

function adicionarParticipante() {
  participantes.value.push(novoParticipante());
}

function removerParticipante(index: number) {
  participantes.value.splice(index, 1);
}

const onSubmit = async () => {
  await AuthenticateService.redirecionaSeNaoAutenticado(router);

  const participantesValidos = participantes.value
    .filter(p => p.tipo)
    .filter(p => p._modoUsername ? !!p._usuarioEncontrado : !!p.nome)
    .map(p => ({
      tipo: p.tipo,
      nome: p._modoUsername ? (p._usuarioEncontrado?.nome || p.nome) : p.nome,
      username: p._modoUsername && p._usuarioEncontrado?.username
        ? p._usuarioEncontrado.username
        : undefined,
    }));

  const escalada = {
    via: Number(route.params.id),
    data: new Date(dataHora.value),
    observacao: observacao.value || undefined,
    participantes: participantesValidos,
    usuario: Number(localStorage.getItem('usuarioId')) || 0,
  };

  try {
    await EscaladaService.criarEscalada(escalada as any);
    onReset();
    Notify.create({ type: 'positive', message: 'Escalada registrada com sucesso!', position: 'top-right', timeout: 3000 });
    emit('closeModal');
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao registrar escalada. Tente novamente.', position: 'top-right', timeout: 3000 });
  }
};

const onReset = () => {
  observacao.value = '';
  dataHora.value = dataHoraAgora();
  participantes.value = [novoParticipante()];
};
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.my-card {
  min-width: 320px;
  max-width: 500px;
  width: 92vw;
  border-radius: 16px;
  margin: auto;
  background-color: $background;
  border: 2px solid $cumes-01;
  box-shadow: 0 8px 32px $box-shadow-dark;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) { width: 600px; max-width: 600px; }
  @media (min-width: 1024px) { width: 700px; max-width: 700px; }
}

.card-header {
  background: linear-gradient(135deg, $cumes-01 0%, cumesDarken($cumes-01, 8%) 100%);
  padding: 20px 28px;
  border-bottom: 3px solid $cumes-03;
  flex-shrink: 0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 800;
  color: $offwhite;
  .title-icon { color: $cumes-04; }
}

.card-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
  @media (max-width: 600px) { padding: 20px 16px; }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;
    &::before { border-color: $cumes-01; border-width: 2px; }
  }
  :deep(.q-field__native) {
    color: $background;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px !important;
    min-height: 36px;
  }
  :deep(input), :deep(textarea) {
    color: $background !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }
  :deep(input::placeholder), :deep(textarea::placeholder) { color: rgba($background, 0.5); }
  &:deep(.q-field--focused) .q-field__control::before { border-color: $cumes-03; border-width: 2px; }
  &:deep(.q-field--error) .q-field__control::before { border-color: $error-color; }
}

.custom-select {
  :deep(.q-field__control) {
    background-color: $offwhite !important;
    border-radius: 8px !important;
    padding: 0 !important;
    &::before { border-color: $cumes-01 !important; border-width: 2px !important; }
  }
  :deep(.q-field__native) {
    color: $background !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    min-height: 36px;
  }
  &:deep(.q-field--focused) .q-field__control::before { border-color: $cumes-03 !important; }
}

// Participantes
.participantes-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.participantes-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.participante-card {
  padding: 12px 14px;
  background: rgba($cumes-01, 0.08);
  border: 1px solid rgba($cumes-01, 0.25);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.participante-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participante-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-03;
}

.remove-btn { color: $error-color !important; }

// Toggle modo usuário / convidado
.participante-modo {
  display: flex;
  gap: 8px;
}

.modo-btn {
  flex: 1;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid rgba($cumes-01, 0.3);
  background: transparent;
  color: rgba($offwhite, 0.5);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.ativo {
    border-color: $cumes-01;
    background: rgba($cumes-01, 0.15);
    color: $cumes-01;
  }

  &:hover:not(.ativo) {
    border-color: rgba($cumes-01, 0.5);
    color: rgba($offwhite, 0.8);
  }
}

// Resultado da busca de usuário
.username-busca {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.busca-status {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  flex-wrap: wrap;

  &.buscando { color: rgba($offwhite, 0.5); }
  &.encontrado { color: $cumes-01; }
  &.nao-encontrado { color: $error-color; }
}

.username-tag {
  font-weight: 600;
  opacity: 0.85;
}

.btn-add-participante {
  background: transparent;
  color: $cumes-01;
  border: 2px dashed rgba($cumes-01, 0.5);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
  width: 100%;

  &:hover {
    background: rgba($cumes-01, 0.08);
    border-style: solid;
  }
}

// Ações
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba($cumes-03, 0.2);
}

.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 8px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  min-height: 36px !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;
  &:hover { background: cumesDarken($cumes-01, 10%) !important; }
}

.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 8px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  min-height: 36px !important;
  &:hover { background: rgba($cumes-01, 0.1) !important; }
}
</style>
