<template>
  <q-page class="q-pa-sm">
    <BotaoVoltar />
    <div class="text-h2 q-mb-md title-margin">{{ via?.nome }}</div>
    <div class="text-subtitle1 q-mb-md title-margin">{{ via?.montanha.nome }}, {{ via?.face.nome }}</div>
    <q-separator spaced />

    <!-- Botões de ação -->
    <div class="action-buttons q-col-12">
      <!-- Verifica se o usuário está autenticado antes de permitir registrar uma escalada -->
      <q-btn rounded class="btn-actions-escalada" icon="add_circle" @click="checkAuthentication('registerEscalada')">
        <div>Registrar uma escalada</div>
      </q-btn>
      <!-- Verifica se o usuário está autenticado antes de permitir adicionar a favoritos -->
      <q-btn rounded class="btn-actions-favorito" icon="star_border" @click="checkAuthentication('addFavorites')">
        <div>Adicionar a Favoritas</div>
      </q-btn>
      <!-- Verifica se o usuário está autenticado antes de permitir adicionar a uma coleção -->
      <q-btn rounded class="btn-actions-colecao" icon="style" @click="checkAuthentication('addToCollection')">
        <div>Adicionar a uma Coleção</div>
      </q-btn>
    </div>

    <div class="row q-col-gutter-none">
      <!-- Bloco Imagem da Via -->
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-5 col-xl-4">
        <CardImagemVia :src="via?.imagem.url!" :alt="via?.nome" />
      </div>

      <!-- Bloco Duração e Extensão -->
      <div class="col-xs-6 col-sm-6 col-md-3 col-lg-2 col-xl-2">
        <q-card class="q-ma-md rounded-borders card">
          <q-item class="row">
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="alarm" class="medium-icon col-4"></q-icon>
                <div class="text-h4 col-4 center">{{ via?.duracao }}</div>
              </div>
              <div class="text-h6 center">DURAÇÃO</div>
            </q-card>
            <q-separator spaced />
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="open_in_full" class="medium-icon col-4"></q-icon>
                <div class="text-h4 col-4 center">{{ via?.extensao }}</div>
              </div>
              <div class="text-h6 center">EXTENSÃO</div>
            </q-card>
          </q-item>
        </q-card>
      </div>
      <!-- Bloco Grau, Crux, Artificial e Exposição -->
      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <q-card class="q-ma-md rounded-borders card">
          <q-item class="row">
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="rotate_90_degrees_cw" class="medium-icon col-4"></q-icon>
                <!-- Substitua o nome do ícone conforme necessário -->
                <div class="text-h4 col-4 center">{{ via?.grau }}°</div>
              </div>
              <div class="text-h6 center">GRAU</div>
            </q-card>
            <q-separator spaced />
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="map" class="medium-icon col-4"></q-icon>
                <!-- Substitua o nome do ícone conforme necessário -->
                <div class="text-h4 col-4 center">{{ via?.crux }}</div>
              </div>
              <div class="text-h6 center">CRUX</div>
            </q-card>
            <q-separator spaced />
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="precision_manufacturing" class="medium-icon col-4"></q-icon>
                <!-- Substitua o nome do ícone conforme necessário -->
                <div class="text-h4 col-4 center">{{ via?.artificial }}</div>
              </div>
              <div class="text-h6 center">ARTIFICIAL</div>
            </q-card>
            <q-separator spaced />
            <q-card class="col-12 margem">
              <div class="top-margem row">
                <q-icon name="sunny" class="medium-icon col-4"></q-icon>
                <!-- Substitua o nome do ícone conforme necessário -->
                <div class="text-h4 col-4 center">{{ via?.exposicao }}</div>
              </div>
              <div class="text-h6 center">EXPOSIÇÃO</div>
            </q-card>
          </q-item>
        </q-card>
      </div>
      <!-- Bloco Detalhes -->
      <div class="col-xs-12 col-sm-8 col-md-12 col-lg-3 col-xl-4">
        <q-card class="q-ma-md rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <div class="top-margem row">
                <q-icon name="format_list_bulleted" class="medium-icon col-4"></q-icon>
                <!-- Substitua o nome do ícone conforme necessário -->
                <div class="text-h6 col-4">{{ via?.detalhes }}</div>
              </div>
              <div class="text-h6 center">DETALHES</div>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Fonte e Conquistadores -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-10">
        <q-card class="q-ma-md rounded-borders card">
          <q-item class="row">
            <q-card class="q-ma-sm card-parametro">
              <div class="top-margem row">
                <q-icon name="auto_stories" class="medium-icon col-4"></q-icon>
                <div class="text-h6 col-4 center">{{ via?.fonte.autor }}</div>
              </div>
              <div class="text-h6 center">FONTE</div>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <div class="top-margem row">
                <q-icon name="groups_2" class="medium-icon col-4"></q-icon>
                <div class="text-h6 col-4 center">{{ via?.conquistadores }}</div>
              </div>
              <div class="text-h6 center">CONQUISTADORES</div>
            </q-card>
            <q-card class="q-ma-sm card-parametro">
              <div class="top-margem row">
                <q-icon name="menu_book" class="medium-icon col-4"></q-icon>
                <div class="text-h6 col-4 center">{{ via?.fonte.referencia }}</div>
              </div>
              <div class="text-h6 center">REFERÊNCIAS</div>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Data -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-2">
        <q-card class="q-ma-md rounded-borders card">
          <q-item>
            <q-card class="q-ma-sm card-parametro">
              <div class="top-margem row">
                <q-icon name="pending_actions" class="medium-icon col-4"></q-icon>
                <div class="text-h6 col-4 center">{{ via?.data }}</div>
              </div>
              <div class="text-h6 center">DATA DO CADASTRO</div>
            </q-card>
          </q-item>
        </q-card>
      </div>

      <!-- Bloco Croquis -->
      <div class="col-12">
        <q-card class="q-ma-md rounded-borders card">
          <q-card-section>
            <!-- Placeholder para o carrossel de fotos -->
            <p><strong>Croquis:</strong></p>
            <CarrosselCroquis :croquis="via?.croquis" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modal para registrar uma nova escalada dessa via -->
    <ModalCriarEscalada :isOpen="showForm" @update:isOpen="showForm = $event" @closeModal="closeEscaladaForm" />

    <q-dialog v-model="showAddToCollectionModal">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Adicionar Via a uma Coleção</div>
        </q-card-section>
        <q-card-section>
          <ItemSugestao
            :items="colecoes"
            itemType="colecao"
            @add-item="addToCollection"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ViaService from 'src/services/ViaService';
import BotaoVoltar from 'components/BotaoVoltar.vue';
import ModalCriarEscalada from 'components/Escalada/ModalCriarEscalada.vue';
import CardImagemVia from 'components/Via/CardImagemVia.vue';
import { Via } from 'src/models/Via';
import CarrosselCroquis from 'components/Croquis/CarrosselCroquis.vue';
import AuthenticateService from 'src/services/AuthenticateService';
import ColecaoService from 'src/services/ColecaoService';
import { Colecao } from 'src/models/Colecao';
import ItemSugestao from 'components/ItemSugestao.vue';

const route = useRoute();
const router = useRouter();
const via = ref<Via>();
const colecoes = ref<Colecao[]>([]);
const showForm = ref(false);
const showAddToCollectionModal = ref(false);

defineOptions({
  name: 'ViaDetalhadaPage'
});

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    via.value = await ViaService.getViaById(id);
  } catch (error) {
    console.error('Erro ao buscar detalhes da via:', error);
  }
});

const checkAuthentication = (action: string) => {
  if (!AuthenticateService.isAuthenticated()) {
    router.push('/auth/login');
  } else {
    switch (action) {
      case 'registerEscalada':
        toggleForm();
        break;
      case 'addFavorites':
        addToFavorites();
        break;
      case 'addToCollection':
        openAddToCollectionModal();
        break;
    }
  }
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const closeEscaladaForm = () => {
  showForm.value = false;
};

const addToFavorites = async () => {
  try {
    await ViaService.addToFavorites(Number(route.params.id));
    Notify.create({
      type: 'positive',
      message: 'Via adicionada a favoritos com sucesso!',
      position: 'top-right',
      timeout: 3000
    });
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Erro desconhecido',
      position: 'top-right',
      timeout: 3000
    });
  }
};

const loadColecoesNotContainingVia = async () => {
  if (via.value) {
    try {
      const result = await ColecaoService.getCollecoesNotContainingVia(via.value.id, 1, 10);
      colecoes.value = result.colecoes;
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  }
};

const openAddToCollectionModal = async () => {
  showAddToCollectionModal.value = true;
  await loadColecoesNotContainingVia();
};

const addToCollection = async (colecao: Colecao) => {
  try {
    if (via.value) {
      await ColecaoService.addViaToColecao(colecao.id, via.value.id);
      Notify.create({
        type: 'positive',
        message: 'Via adicionada à coleção com sucesso!',
        position: 'top-right',
        timeout: 3000
      });
      // Marcar como adicionada
      colecoes.value = colecoes.value.map(c => {
        if (c.id === colecao.id) {
          return {
            ...c,
            added: true
          };
        }
        return c;
      });
    }
  } catch (error) {
    console.error('Erro ao adicionar a coleção:', error);
  }
};

</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  color: black;
}

.title-margin {
  margin-left: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.row {
  display: flex;
  flex-wrap: wrap; /* Permite que os itens se movam para a próxima linha se necessário */
}

.card {
  display: flex;
  flex-direction: column;
  height: 93%; /* Garante que o card ocupe toda a altura disponível da coluna */
}

.q-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Garante que o conteúdo do card se distribua igualmente */
}

.card-parametro{
  width: 100%;
}

.center{
  text-align: center;
}

.margem{
  margin: 8px 0px 8px 0px;
}

.btn-actions-escalada {
  background-color: #bce9b4;
}

.btn-actions-favorito {
  background-color: #fcbd7b;
}

.btn-actions-colecao {
  background-color: palevioletred;
}

</style>
